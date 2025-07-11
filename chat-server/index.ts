import { serve } from "npm:http-server@14.1.1"
import { Server } from "npm:socket.io@4.7.5"
import { createClient } from "npm:@supabase/supabase-js@2.39.3"

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

// Create HTTP server
const server = serve({ port: 3001 })

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["authorization", "x-client-info", "apikey", "content-type"],
    credentials: true
  }
})

// Store active users
const activeUsers = new Map()

io.on("connection", (socket) => {
  const userId = socket.handshake.auth.userId
  
  if (userId) {
    // Store user connection
    activeUsers.set(userId, socket.id)
    
    // Join user to their rooms
    joinUserRooms(socket, userId)
    
    // Handle typing events
    socket.on("typing", (data) => {
      socket.to(`room:${data.roomId}`).emit(`typing:${data.roomId}`, {
        userId: data.userId
      })
    })
    
    // Handle disconnect
    socket.on("disconnect", () => {
      activeUsers.delete(userId)
    })
  } else {
    // No user ID provided, disconnect
    socket.disconnect()
  }
})

async function joinUserRooms(socket, userId) {
  try {
    // Get all rooms the user is part of
    const { data, error } = await supabase
      .from('chat_room_participants')
      .select('room_id')
      .eq('user_id', userId)
    
    if (error) throw error
    
    // Join each room
    data.forEach(({ room_id }) => {
      socket.join(`room:${room_id}`)
    })
  } catch (error) {
    console.error('Error joining user rooms:', error)
  }
}

// Endpoint for status check
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }
  
  return new Response(
    JSON.stringify({ 
      status: "running",
      connections: activeUsers.size
    }),
    { 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200 
    }
  )
})