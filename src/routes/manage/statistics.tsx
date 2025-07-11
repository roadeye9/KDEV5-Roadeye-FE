import { useDrivingLogMonthlyCount } from "@/hooks/api/dashboard";
import { useDailyStatisticsQuery } from "@/hooks/api/statistics";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { BarChart2, TrendingUp, CalendarDays, Clock, Car } from "lucide-react";
import { BarChart, Bar } from 'recharts';
import { Line, CartesianGrid, ResponsiveContainer, XAxis, Tooltip, Legend, YAxis, LineChart } from "recharts";
import { useState } from 'react';

const Statistics = () => {
  const { data: monthlyStats } = useDrivingLogMonthlyCount();

  // 어제 날짜를 기본값으로 설정
  const getYesterday = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  };
  const [date, setDate] = useState(getYesterday());
  const { data: dailyStats } = useDailyStatisticsQuery({ date });

  // 월별 통계 요약 계산
  const totalCount = monthlyStats?.reduce((sum, d) => sum + (d.count ?? 0), 0) ?? 0;
  const max = monthlyStats && monthlyStats.length > 0 ? Math.max(...monthlyStats.map(d => d.count)) : 0;
  const min = monthlyStats && monthlyStats.length > 0 ? Math.min(...monthlyStats.map(d => d.count)) : 0;
  const avg = monthlyStats && monthlyStats.length > 0 ? Math.round(totalCount / monthlyStats.length) : 0;
  const recentMonth = monthlyStats && monthlyStats.length > 0 ? monthlyStats[monthlyStats.length - 1].month : '-';

  // 일별 통계 평균 계산 (단위 변환 포함)
  const totalDistanceKm = (dailyStats?.distance ?? 0) / 1000;
  const totalDurationMin = (dailyStats?.duration ?? 0) / 60;
  const avgDistanceKm = dailyStats?.totalDrivingCount ? totalDistanceKm / dailyStats.totalDrivingCount : 0;
  const avgDurationMin = dailyStats?.totalDrivingCount ? totalDurationMin / dailyStats.totalDrivingCount : 0;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* 상단 타이틀 */}
        <div className="flex items-center gap-4 mb-2">
          <BarChart2 className="w-10 h-10 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">통계</h1>
            <p className="text-gray-500 text-sm mt-1">월별 운행 현황과 요약 통계를 한눈에 확인하세요.</p>
          </div>
        </div>
        {/* 상단 요약 카드
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl bg-blue-50 p-6 flex flex-col items-center shadow">
            <Car className="w-8 h-8 text-blue-500 mb-2" />
            <div className="text-xs text-gray-500 mb-1">어제 총 운행</div>
            <div className="text-2xl font-bold text-blue-600">{dailyStats?.totalDrivingCount?.toLocaleString() ?? 0} 건</div>
          </div>
          <div className="rounded-2xl bg-green-50 p-6 flex flex-col items-center shadow">
            <TrendingUp className="w-8 h-8 text-green-500 mb-2" />
            <div className="text-xs text-gray-500 mb-1">오늘 총 거리</div>
            <div className="text-2xl font-bold text-green-600">{totalDistanceKm.toLocaleString(undefined, { maximumFractionDigits: 1 })} km</div>
          </div>
          <div className="rounded-2xl bg-purple-50 p-6 flex flex-col items-center shadow">
            <Clock className="w-8 h-8 text-purple-500 mb-2" />
            <div className="text-xs text-gray-500 mb-1">오늘 총 시간</div>
            <div className="text-2xl font-bold text-purple-600">{totalDurationMin.toLocaleString(undefined, { maximumFractionDigits: 1 })} 분</div>
          </div>
        </div> */}
        {/* 월별 통계 카드 */}
        <Card className="mt-8 shadow-xl rounded-2xl border-0 bg-white">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">월별 운행 횟수</h2>
              <p className="text-gray-400 text-xs mt-1">최근 {monthlyStats?.length ?? 0}개월간 운행 데이터</p>
            </div>
            <div className="flex flex-wrap gap-4 mt-2 md:mt-0">
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400">총 운행</span>
                <span className="font-bold text-blue-600 text-lg">{totalCount.toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400">최근 월</span>
                <span className="font-bold text-gray-700 text-lg">{recentMonth}</span>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <BarChart
                  data={monthlyStats}
                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="count"
                    name="월별 운행 건수"
                    fill="#3b82f6"
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* 차트 하단 요약 */}
            <div className="flex flex-wrap justify-center gap-8 mt-8 text-center border-t pt-6">
              <div>
                <div className="text-xs text-gray-400 mb-1">최고</div>
                <div className="font-bold text-green-600 text-lg">{max.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">최저</div>
                <div className="font-bold text-red-500 text-lg">{min.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">평균</div>
                <div className="font-bold text-blue-500 text-lg">{avg.toLocaleString()}</div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 일별 통계 카드 */}
        <Card className="mt-10 shadow-xl rounded-2xl border-0 bg-white">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">일별 운행 통계</h2>
              <p className="text-gray-400 text-xs mt-1">선택한 날짜의 운행 현황을 확인하세요.</p>
              <div className="flex items-center gap-2 mt-2">
                <CalendarDays className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-blue-500 font-medium">{date}</span>
              </div>
            </div>
            <div>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              />
            </div>
          </CardHeader>
          <CardBody>
            {/* 시간대별 차량 수 차트 */}
            {dailyStats?.hourlyStatisticsInfos && (
              <div className="mt-8 relative">
                {/* 요약 + 차트 전체를 감싸는 영역 */}
                <div>
                  <div className="flex justify-around text-center mb-6">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">평균 운행 거리</div>
                      <div className="font-bold text-blue-600 text-lg">{avgDistanceKm.toLocaleString(undefined, { maximumFractionDigits: 1 })} km</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">평균 운행 시간</div>
                      <div className="font-bold text-green-600 text-lg">{avgDurationMin.toLocaleString(undefined, { maximumFractionDigits: 1 })} 분</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">운행 건수</div>
                      <div className="font-bold text-purple-600 text-lg">{(dailyStats.totalDrivingCount ?? 0).toLocaleString()}</div>
                    </div>
                  </div>
                  <h3 className="text-md font-semibold text-gray-700 mb-2 text-center">시간대별 운행 차량 수</h3>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <LineChart
                        data={dailyStats.hourlyStatisticsInfos}
                        margin={{ top: 10, right: 20, left: -10, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" tickFormatter={(hour) => `${hour}시`} />
                        <YAxis allowDecimals={false} />
                        <Tooltip formatter={(value) => `${value}대`} labelFormatter={(label) => `${label}시`} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="vehicleCount"
                          name="운행 차량 수"
                          stroke="#6366f1"
                          strokeWidth={2}
                          activeDot={{ r: 7 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  {(!dailyStats?.hourlyStatisticsInfos || dailyStats.hourlyStatisticsInfos.length === 0) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-10 rounded-2xl">
                      <span className="text-gray-500 text-lg font-semibold">통계 데이터가 없습니다.</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardBody>
        </Card>
        
      </div>
    </div>
  );
};

export default Statistics;
