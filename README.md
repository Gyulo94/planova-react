# 🚀 Planova Client: Next-Generation Project Management Tool

Planova는 현대적인 협업 환경을 위한 고성능 프로젝트 관리 솔루션입니다.
본 문서는 Planova 클라이언트 사이드의 아키텍처와 핵심 기술 역량을 설명하기 위해 작성되었습니다.

## 🛠 Tech Stack (기술 스택)

### Core

- **React 19**: 최신 리액트 기능을 활용한 선언적 UI 개발
- **Vite 6**: 초고속 빌드 및 HMR 환경 구축
- **TypeScript**: 타입 안정성을 통한 런타임 에러 최소화

### State & Data Management

- **Zustand**: Flux 패턴 기반의 가벼운 클라이언트 상태 관리
- **TanStack Query v5**: 서버 데이터 캐싱, 자동 동기화 및 낙관적 업데이트 구현
- **Axios**: 인터셉터를 활용한 효율적인 HTTP 통신 로직

### UI & UX

- **Tailwind CSS 4**: 최신 CSS 기능을 활용한 유연한 스타일링
- **shadcn/ui (Radix UI)**: 접근성이 보장된 고품질 프리미엄 컴포넌트 시스템
- **Lucide React**: 일관성 있는 벡터 아이콘 시스템

### Advanced Features

- **TipTap Editor**: 마크다운, 표, 이미지 업로드를 지원하는 커스텀 리치 텍스트 에디터
- **@dnd-kit**: 칸반 보드 및 리스트 정렬을 위한 고도화된 드래그 앤 드롭 엔진
- **Socket.io**: 실시간 알림 및 협업 데이터 동기화
- **Recharts**: 데이터 기반 시각화를 위한 차트 시스템

## 📊 상세 프로젝트 구조 (Project Structure)

Planova는 코드의 응집도를 높이고 결합도를 낮춘 설계를 채택했습니다.

```text
client/
├── 📂 public/           # 정적 에셋 (폰트, 로고 등)
├── 📂 style/            # 전역 스타일 및 Tailwind v4 설정
└── 📂 src/
    ├── 📂 components/   # 공용 컴포넌트
    │   ├── 📂 shared/   # 레이아웃, 공통 UI (RootLayout 등)
    │   └── 📂 ui/       # shadcn/ui 기반 원자적(Atomic) 컴포넌트
    ├── 📂 features/     # 핵심 비즈니스 로직 (Feature-based)
    │   └── 📂 [domain]/ # task, project, workspace 등
    │       ├── 📄 api.ts    # Axios 기반 API 통신 정의
    │       ├── 📄 query.ts  # TanStack Query (Hooks) 정의
    │       ├── 📄 store.ts  # Zustand 전역 상태 정의
    │       ├── 📄 type.ts   # TS 인터페이스 및 타입 정의
    │       ├── 📄 schema.ts # Zod 기반 폼 검증 스키마
    │       └── 📂 components/ # 해당 도메인 전용 UI
    ├── 📂 pages/        # 라우팅 단위 페이지 컴포넌트
    ├── 📂 routes/       # 고도화된 라우트 가드 (PrivateRoute, AuthRoute 등)
    ├── 📂 hooks/        # 전역 재사용 커스텀 훅
    ├── 📂 providers/    # 전역 컨텍스트 제공 (Query, Theme, Auth 등)
    ├── 📂 lib/          # 유틸리티 및 외부 라이브러리 설정 (Axios 인스턴스 등)
    ├── 📄 App.tsx       # 중앙 집중식 선언적 라우팅 설정
    └── 📄 main.tsx      # 애플리케이션 진입점 및 Provider 주입
```

## 🛠 기술적 심층 분석 (Deep Dive)

### 1. 고도화된 라우팅 가드 시스템

`react-router-dom` v7의 중첩 라우팅을 활용하여 보안과 권한 관리를 자동화했습니다.

- **PrivateRoute**: 인증되지 않은 사용자 접근 차단
- **WorkspaceRoute**: 특정 워크스페이스 참여 권한 검증
- **ProjectRoute**: 특정 프로젝트 참여 권한 검증
- **WorkspaceOwnerRoute**: 소유자 전용 설정 페이지 접근 제어

### 2. 효율적인 상태 관리 전략

상태의 성격에 따라 관리 주체를 명확히 분리하여 성능을 최적화했습니다.

- **서버 상태 (Server State)**: `TanStack Query`를 사용하여 캐싱, 자동 리페칭, 낙관적 업데이트(Optimistic Updates)를 구현했습니다.
- **클라이언트 상태 (Client State)**: `Zustand`를 사용하여 모달 상태, 필터 조건 등 가벼운 전역 상태를 관리합니다. 불필요한 리렌더링을 방지하기 위해 셀렉터 패턴을 사용합니다.

### 3. 강력한 사용자 경험 (UX) 제공

- **Rich Interaction**: `dnd-kit`을 활용하여 칸반 보드 내 카드 이동 및 리스트 순서 변경 시 부드러운 애니메이션과 즉각적인 반응성을 제공합니다.
- **Interactive Documentation**: `TipTap`을 커스터마이징하여 단순 텍스트가 아닌 이미지, 코드 블록, 마크다운이 어우러진 협업 문서를 작성할 수 있습니다.

### 4. 코드 품질 및 안정성

- **Type Safety**: TypeScript를 프로젝트 전반에 적용하고, API 응답과 폼 데이터에 대해 엄격한 인터페이스를 정의했습니다.
- **Validation**: `Zod`와 `React Hook Form`을 결합하여 클라이언트 사이드에서 실시간 데이터 검증을 수행하며, 서버로 잘못된 데이터가 전송되는 것을 사전에 방지합니다.
- **Real-time Sync**: `Socket.io`를 통해 다른 사용자의 활동을 실시간으로 감지하고 UI에 즉각 반영합니다.

## 🚀 시작하기

```bash
# 의존성 설치
npm install
# 개발 서버 실행
npm run dev
# 프로덕션 빌드
npm run build
```

## ✨ Key Features (주요 기능)

1. **실시간 협업 칸반 보드**: `dnd-kit`을 활용한 부드러운 UI와 소켓 통신을 통한 실시간 상태 동기화
2. **지능형 타임라인 (Gantt)**: 마일스톤과 에픽 기반의 시각적 일정 관리 및 의존성 파악
3. **고도화된 문서 편집기**: TipTap 기반으로 협업 중 코드 블록, 이미지, 마크다운 형식을 자유롭게 사용
4. **반응형 디자인**: 다양한 디바이스 환경에 최적화된 유연한 레이아웃 제공
5. **다크 모드 지원**: 사용자 경험을 고려한 완벽한 다크/라이트 테마 시스템
