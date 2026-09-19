import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { CheckCircle, LayoutDashboard } from 'lucide-react';

const PaymentSuccess = () => {
    const [status, setStatus] = useState('verifying');
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        const raw = sessionStorage.getItem('kkiapay_paid');
        if (!raw) {
            setStatus('confirmed');
            return;
        }

        let parsed;
        try { parsed = JSON.parse(raw); } catch { setStatus('confirmed'); return; }

        const { orderId: oid, transactionId } = parsed;
        setOrderId(oid);
        sessionStorage.removeItem('kkiapay_paid');

        axios.post('/payments/verify', {
            order_id:       oid,
            transaction_id: transactionId,
        }, { timeout: 30000 })
            .finally(() => setStatus('confirmed'));
    }, []);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0fdf4', padding: 20 }}>
            <div style={{ background: 'white', borderRadius: 24, padding: '48px 40px', textAlign: 'center', maxWidth: 480, width: '100%', boxShadow: '0 8px 32px rgba(22,163,74,0.12)' }}>

                {status === 'verifying' ? (
                    <>
                        <div style={{ width: 64, height: 64, border: '5px solid #16a34a', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 24px' }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#111827', marginBottom: 8 }}>Confirmation en cours…</h2>
                        <p style={{ color: '#6b7280', fontSize: 15 }}>Nous confirmons votre paiement, merci de patienter.</p>
                    </>
                ) : (
                    <>
                        <div style={{ width: 80, height: 80, background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '3px solid #bbf7d0' }}>
                            <CheckCircle style={{ width: 40, height: 40, color: '#16a34a' }} />
                        </div>
                        <h2 style={{ fontSize: 30, fontWeight: 900, color: '#111827', marginBottom: 8 }}>Paiement confirmé !</h2>
                        {orderId && (
                            <p style={{ color: '#6b7280', fontSize: 16, marginBottom: 8 }}>
                                Votre commande <strong style={{ color: '#111827' }}>#{orderId}</strong> est en cours de préparation.
                            </p>
                        )}
                        <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 32 }}>
                            L'agriculteur va bientôt confirmer et expédier votre commande.
                        </p>
                        <Link
                            to="/dashboard"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#16a34a', color: 'white', padding: '14px 32px', borderRadius: 12, fontWeight: 800, textDecoration: 'none', fontSize: 15 }}
                        >
                            <LayoutDashboard style={{ width: 18, height: 18 }} />
                            Voir mes commandes
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;
