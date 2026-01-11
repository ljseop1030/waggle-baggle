import React from 'react';
import { Screen } from "../App";

interface MapScreenProps {
  onLocationClick: (screen: Screen) => void;
}

export function MapScreen({ onLocationClick }: MapScreenProps) {
  // 큐브의 한 변의 길이를 설정 (64px = tailwind w-16 h-16)
  // 정중앙에서 각 면까지의 거리는 절반인 32px입니다.
  const cubeSize = "w-16 h-16";
  const offset = "32px";
  const negOffset = "-32px";

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="p-6 pb-4">
        <h1 className="text-3xl font-bold text-[#0A1F62] text-center">
          와글바글
        </h1>
        <p className="text-center text-[#8F8F8F] text-sm mt-1">
          완벽한 스터디 공간을 찾아보세요!
        </p>
      </div>

      <div className="flex-1 relative px-4 pb-8">
        <div className="relative w-full h-full flex items-center justify-center perspective-[1200px]">
          <div
            className="relative w-80 h-96"
            style={{
              transform: "rotateX(60deg) rotateZ(-45deg)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Campus Ground */}
            <div
              className="absolute w-full h-full bg-slate-200 rounded-2xl shadow-2xl"
              style={{ transform: "translateZ(-20px)" }}
            >
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-1 p-4 opacity-20">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div
                    key={i}
                    className="border border-slate-400 rounded-sm"
                  ></div>
                ))}
              </div>
            </div>

            {/* 1. 와글와글 라운지 (Navy Cube) */}
            <div
              className="absolute"
              style={{
                top: "25%",
                left: "20%",
                transformStyle: "preserve-3d",
              }}
            >
              <button
                onClick={() => onLocationClick("wagleLounge")}
                className="relative group cursor-pointer"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className={`relative ${cubeSize}`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* 정육면체 6면 정밀 조립 */}
                  {/* 윗면 (Top) */}
                  <div
                    className={`absolute inset-0 bg-[#1A2E72] shadow-inner`}
                    style={{
                      transform: `translateZ(${offset})`,
                    }}
                  />
                  {/* 정면 (Front) */}
                  <div
                    className={`absolute inset-0 bg-[#0A1F62] flex items-center justify-center`}
                    style={{
                      transform: `rotateX(-90deg) translateZ(${offset})`,
                    }}
                  >
                    {/* 창문 디테일 */}
                    <div className="grid grid-cols-2 gap-1 p-2 w-full h-full">
                      <div className="bg-yellow-200/40 rounded-sm" />
                      <div className="bg-yellow-200/40 rounded-sm" />
                      <div className="bg-yellow-200/40 rounded-sm" />
                      <div className="bg-yellow-200/40 rounded-sm" />
                    </div>
                  </div>
                  {/* 우측면 (Right) */}
                  <div
                    className={`absolute inset-0 bg-[#051136]`}
                    style={{
                      transform: `rotateY(90deg) translateZ(${offset})`,
                    }}
                  />
                  {/* 좌측면 (Left) - 안보이지만 구조 유지 */}
                  <div
                    className={`absolute inset-0 bg-[#051136]`}
                    style={{
                      transform: `rotateY(-90deg) translateZ(${offset})`,
                    }}
                  />
                  {/* 뒷면 (Back) */}
                  <div
                    className={`absolute inset-0 bg-[#0A1F62]`}
                    style={{
                      transform: `rotateX(90deg) translateZ(${offset})`,
                    }}
                  />
                  {/* 바닥면 (Bottom) */}
                  <div
                    className={`absolute inset-0 bg-[#051136]`}
                    style={{
                      transform: `translateZ(${negOffset})`,
                    }}
                  />
                </div>

                {/* Label */}
                <div
                  className="absolute"
                  style={{
                    transform:
                      "translateZ(60px) rotateX(-60deg) rotateZ(45deg)",
                    left: "50%",
                    marginLeft: "-40px",
                  }}
                >
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg animate-bounce whitespace-nowrap">
                    와글와글 ✨
                  </div>
                </div>
              </button>
            </div>

            {/* 2. 프론티어홀 204호 (Red Cube) */}
            <div
              className="absolute"
              style={{
                top: "55%",
                left: "55%",
                transformStyle: "preserve-3d",
              }}
            >
              <button
                onClick={() => onLocationClick("frontierHall")}
                className="relative group cursor-pointer"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className={`relative ${cubeSize}`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* 정육면체 6면 정밀 조립 */}
                  <div
                    className={`absolute inset-0 bg-[#F22E33] shadow-inner`}
                    style={{
                      transform: `translateZ(${offset})`,
                    }}
                  />
                  <div
                    className={`absolute inset-0 bg-[#B90005]`}
                    style={{
                      transform: `rotateX(-90deg) translateZ(${offset})`,
                    }}
                  >
                    <div className="grid grid-cols-2 gap-1 p-2 w-full h-full">
                      <div className="bg-yellow-200/40 rounded-sm" />
                      <div className="bg-yellow-200/40 rounded-sm" />
                      <div className="bg-yellow-200/40 rounded-sm" />
                      <div className="bg-yellow-200/40 rounded-sm" />
                    </div>
                  </div>
                  <div
                    className={`absolute inset-0 bg-[#8B0004]`}
                    style={{
                      transform: `rotateY(90deg) translateZ(${offset})`,
                    }}
                  />
                  <div
                    className={`absolute inset-0 bg-[#8B0004]`}
                    style={{
                      transform: `rotateY(-90deg) translateZ(${offset})`,
                    }}
                  />
                  <div
                    className={`absolute inset-0 bg-[#B90005]`}
                    style={{
                      transform: `rotateX(90deg) translateZ(${offset})`,
                    }}
                  />
                  <div
                    className={`absolute inset-0 bg-[#610003]`}
                    style={{
                      transform: `translateZ(${negOffset})`,
                    }}
                  />
                </div>

                {/* Floating Label */}
                <div
                  className="absolute"
                  style={{
                    transform:
                      "translateZ(60px) rotateX(-60deg) rotateZ(45deg)",
                    left: "50%",
                    marginLeft: "-40px",
                    top: "-20px",
                  }}
                >
                  <div className="bg-[#B90005] text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg animate-bounce whitespace-nowrap">
                    프론티어관<br />204호 🔥
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Info Card */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50">
          <p className="text-xs text-gray-500 text-center font-medium">
            💡 건물을 탭하여 좌석 현황을 확인하세요
          </p>
        </div>
      </div>
    </div>
  );
}