var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useEffect, useState } from 'react';
/**
 * Hook pour récupérer le quota Resend via la fonction Edge monitor-resend-quota
 * @returns { sent, limit, percent, loading, error }
 */
export function useResendQuota() {
    const [quota, setQuota] = useState({ sent: 0, limit: 0, percent: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        function fetchQuota() {
            return __awaiter(this, void 0, void 0, function* () {
                setLoading(true);
                setError(null);
                try {
                    const res = yield fetch('https://klwugophjvzctlautsqz.functions.supabase.co/monitor-resend-quota');
                    if (!res.ok)
                        throw new Error(yield res.text());
                    const data = yield res.json();
                    setQuota({
                        sent: data.sent,
                        limit: data.limit,
                        percent: Math.round((data.sent / data.limit) * 100),
                    });
                }
                catch (e) {
                    setError(e.message);
                }
                setLoading(false);
            });
        }
        fetchQuota();
    }, []);
    return Object.assign(Object.assign({}, quota), { loading, error });
}
