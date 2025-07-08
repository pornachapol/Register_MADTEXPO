// pages/staff/[boothId].tsx

import { useRouter } from 'next/router';
import { useState } from 'react';

export default function StaffConfirmPage() {
  const router = useRouter();
  const { boothId, userId, userPhone } = router.query;

  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const staffPassword = '1234'; // ✅ อย่าลืมย้ายไปเป็น env ถ้า deploy จริง

  const handleConfirm = async () => {
    if (password !== staffPassword) {
      setResult('❌ รหัสผ่านไม่ถูกต้อง');
      return;
    }

    setLoading(true);
    setResult('⏳ กำลังบันทึก...');

    try {
      const response = await fetch('/api/gs-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'registerStamp',
          userId,
          boothId,
          userPhone,
          staffId: 'staff'
        })
      });
      const data = await response.json();
      if (data.success) {
        setResult(`✅ ${data.message}`);
      } else {
        setResult(`❌ ${data.message}`);
      }
    } catch (err) {
      setResult('❌ เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-xl font-bold mb-4">ยืนยันการ Stamp บูธ {boothId}</h1>
      <input
        type="password"
        placeholder="รหัส Staff"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border px-4 py-2 rounded mb-2 w-full max-w-xs"
      />
      <button
        onClick={handleConfirm}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full max-w-xs"
        disabled={loading}
      >
        ยืนยันการ Stamp
      </button>
      {result && <p className="mt-4 text-center whitespace-pre-line">{result}</p>}
    </div>
  );
}
