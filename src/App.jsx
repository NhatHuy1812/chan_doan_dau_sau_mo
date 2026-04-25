import React, { useState } from 'react';
import surgeryIcon from './assets/surgery.png';

// Thành phần nút lựa chọn (Có/Không hoặc Nam/Nữ)
const ToggleBtn = ({ label, active, onClick, options = { yes: "Có", no: "Không" } }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <span className="text-sm font-bold text-gray-700 uppercase tracking-tight pr-4">{label}</span>
    <div className="flex bg-gray-200 rounded-md p-1 min-w-[120px]">
      <button
        onClick={() => onClick(1)}
        className={`flex-1 py-1 px-2 text-[10px] font-black rounded transition-all uppercase ${active === 1 ? 'bg-[#1D4ED8] text-white shadow-sm' : 'text-gray-500'}`}
      >
        {options.yes}
      </button>
      <button
        onClick={() => onClick(0)}
        className={`flex-1 py-1 px-2 text-[10px] font-black rounded transition-all uppercase ${active === 0 ? 'bg-[#64748b] text-white shadow-sm' : 'text-gray-500'}`}
      >
        {options.no}
      </button>
    </div>
  </div>
);

function App() {
  const [ageInput, setAgeInput] = useState('');
  const [data, setData] = useState({ 
    is_female: 0, asa_ge3: 0, high_anxiety: 0, 
    time_ge120: 0, regional_anes: 0, non_opioid: 0 
  });
  const [result, setResult] = useState(null);

  const calculate = () => {
    const ageValue = parseInt(ageInput) >= 60 ? 1 : 0;

    // Công thức hồi quy logistic dựa trên các hệ số β
    // z = -1.6 + 0.65*(Tuổi≥60) + 0.72*(Nữ) + 0.88*(ASA≥III) + 1.25*(Lo âu) + 0.58*(Thời gian≥120) - 1.10*(Gây tê vùng) - 0.85*(Non-opioid)
    const z = -1.6 
              + (0.65 * ageValue) 
              + (0.72 * data.is_female) 
              + (0.88 * data.asa_ge3) 
              + (1.25 * data.high_anxiety) 
              + (0.58 * data.time_ge120) 
              - (1.10 * data.regional_anes) 
              - (0.85 * data.non_opioid);

    const p = 1 / (1 + Math.exp(-z));
    setResult({ 
      p: p.toFixed(2), 
      percent: Math.round(p * 100), 
      risk: p > 0.5 ? 'NGUY CƠ CAO' : 'NGUY CƠ THẤP' 
    });
  };

  const handleReset = () => {
    setAgeInput('');
    setData({ is_female: 0, asa_ge3: 0, high_anxiety: 0, time_ge120: 0, regional_anes: 0, non_opioid: 0 });
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans text-gray-900">
      {/* Header với thông tin Bệnh viện và Khoa */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={surgeryIcon} alt="Logo" className="w-10 h-10" />
            <div>
              <h2 className="text-[10px] md:text-xs font-bold text-blue-600 uppercase tracking-[0.1em] leading-tight">
                Bệnh viện Ung Bướu • Khoa Gây mê hồi sức
              </h2>
              <h1 className="font-black text-gray-900 text-base md:text-xl tracking-tighter uppercase">
                DỰ ĐOÁN ĐAU SAU MỔ
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full p-4 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* KHỐI NHẬP LIỆU */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gray-50 px-6 py-5 border-b border-gray-100">
  
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  Nhập thông số lâm sàng để đánh giá
                </p>
              </div>
              
              <div className="p-6 space-y-1">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm font-bold text-gray-700 uppercase tracking-tight pr-4">Tuổi bệnh nhân</span>
                  <input 
                    type="number" 
                    placeholder="Nhập..."
                    value={ageInput}
                    onChange={(e) => setAgeInput(e.target.value)}
                    className="bg-gray-100 border-none rounded-md px-3 py-2 text-sm font-bold w-[100px] focus:ring-2 focus:ring-blue-500 text-right"
                  />
                </div>

                <ToggleBtn 
                  label="Giới tính" 
                  active={data.is_female} 
                  onClick={(val) => setData({...data, is_female: val})} 
                  options={{ yes: "Nữ", no: "Nam" }}
                />
                
                <ToggleBtn label="Phân loại ASA ≥ III" active={data.asa_ge3} onClick={(val) => setData({...data, asa_ge3: val})} />
                <ToggleBtn label="Lo âu cao (APAIS ≥ 11)" active={data.high_anxiety} onClick={(val) => setData({...data, high_anxiety: val})} />
                <ToggleBtn label="Thời gian mổ ≥ 120 phút" active={data.time_ge120} onClick={(val) => setData({...data, time_ge120: val})} />
                <ToggleBtn label="Có sử dụng gây tê vùng" active={data.regional_anes} onClick={(val) => setData({...data, regional_anes: val})} />
                <ToggleBtn label="Dùng Non-opioid ≥ 2 loại" active={data.non_opioid} onClick={(val) => setData({...data, non_opioid: val})} />
              </div>

              <div className="p-6 bg-gray-50 flex gap-4">
                <button onClick={calculate} className="flex-1 bg-[#1D4ED8] text-white py-4 rounded-lg font-black uppercase shadow-md hover:bg-blue-700 transition-all active:scale-95">
                  Tính toán kết quả
                </button>
                <button onClick={handleReset} 
                        className="px-6 py-4 border border-gray-300 text-gray-600 rounded-lg font-bold uppercase hover:bg-gray-100 transition-all">
                  Làm mới
                </button>
              </div>
            </div>
          </div>

          {/* KHỐI KẾT QUẢ - Desktop: Bên phải, Mobile: Bên dưới */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden lg:sticky lg:top-32 border border-gray-100">
              <div className="bg-[#5C727D] px-6 py-3">
                <h2 className="text-white font-bold uppercase text-[10px] tracking-widest text-center">Báo cáo phân tích</h2>
              </div>
              
              <div className="p-6 space-y-8">
                {result ? (
                  <>
                    <div className="text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <span className="text-xs font-black text-gray-400 uppercase">Xác suất nguy cơ (P)</span>
                      <div className="flex flex-col items-center gap-4 mt-2">
                        <span className="text-6xl font-black text-gray-800 tracking-tighter">{result.p}</span>
                        <div className="w-full h-3 bg-gray-100 rounded-full relative overflow-hidden shadow-inner border border-gray-50">
                          <div className={`h-full transition-all duration-700 ${result.percent > 50 ? 'bg-red-500' : 'bg-green-500'}`} 
                               style={{ width: `${result.percent}%` }}></div>
                        </div>
                      </div>
                      <p className="text-[9px] text-gray-400 mt-4 uppercase font-bold">Mô hình hồi quy Logistic đa biến</p>
                    </div>

                    <div className="pt-6 border-t border-gray-100 text-center">
                      <span className="text-xs font-black text-gray-400 uppercase block mb-2">Phân loại lâm sàng</span>
                      <div className={`flex items-center justify-center gap-2 font-black text-2xl uppercase tracking-tighter ${result.percent > 50 ? 'text-red-600' : 'text-green-600'}`}>
                        {result.percent > 50 ? '⚠️' : '✅'} {result.risk}
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <p className="text-[11px] text-blue-900 leading-tight font-bold uppercase tracking-tighter italic">
                        Lưu ý: {result.percent > 50 ? 'Cần can thiệp giảm đau đa mô thức và theo dõi sát điểm đau NRS.' : 'Thực hiện quy trình theo dõi và giảm đau thông thường.'}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="py-16 text-center text-gray-300">
                    <div className="text-6xl mb-4 grayscale opacity-20">🏥</div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
                      Vui lòng nhập liệu<br/>để nhận kết quả
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto py-8 px-6 text-center text-gray-400 text-[10px] uppercase font-bold tracking-[0.3em]">
        Hỗ trợ quyết định lâm sàng • Chỉ lưu hành nội bộ
      </footer>
    </div>
  );
}

export default App;