# Fix for Supabase Import in create-checkout-session

## Issue Identified

In the file `functions/create-checkout-session/index.ts`, line 2 contains the following import:

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
```

This is causing two linter issues:
- Uncached or missing remote URL: https://esm.sh/@supabase/supabase-js@2 (no-cache)
- The import specifier can be remapped to "@supabase/supabase-js" which will resolve it via the active import map. (import-map-remap)

## Solution

The project has an import map defined in `supabase/import_map.json` that maps `@supabase/supabase-js` to `https://esm.sh/@supabase/supabase-js@2`.

The import statement should be changed to:

```typescript
import { createClient } from '@supabase/supabase-js';
```

This will use the import map to resolve the module, which is the recommended approach according to the linter.

## Implementation Steps

1. Open the file `functions/create-checkout-session/index.ts`
2. Replace line 2 with the corrected import statement
3. Save the file

## Additional Notes

No other issues were identified in the file. The rest of the code can remain unchanged.