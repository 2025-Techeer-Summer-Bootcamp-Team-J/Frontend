import { useAuth, useClerk } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import LoadingPage from "../pages/LoadingPage";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  const { openSignIn } = useClerk();
  const location = useLocation();

  useEffect(() => {
    // Clerk 라이브러리가 로드되었고, 사용자가 로그인하지 않은 경우에만 실행합니다.
    if (isLoaded && !isSignedIn) {
      const returnTo = location.pathname + location.search + location.hash;
      
      // 사용자가 보호된 경로로 이동할 때마다 로그인 흐름을 시작합니다.
      openSignIn({
        afterSignInUrl: returnTo,
        afterSignUpUrl: returnTo,
      });
    }
    // location.key를 의존성 배열에 추가하여, 동일한 경로로 다시 이동해도
    // (예: 헤더에서 같은 메뉴를 다시 클릭) 이 효과가 다시 실행되도록 합니다.
  }, [isLoaded, isSignedIn, openSignIn, location.key]);

  // Clerk가 로드되는 동안 로딩 화면을 표시합니다.
  if (!isLoaded) {
    return <LoadingPage />;
  }

  // 사용자가 로그인했다면, 요청된 페이지의 콘텐츠를 렌더링합니다.
  if (isSignedIn) {
    return children;
  }

  // 로그인하지 않은 경우, useEffect가 로그인 모달을 열게 됩니다.
  // 이 때 null을 반환하여, 로그인 모달 뒤에 보호된 콘텐츠가 렌더링되지 않도록 합니다.
  return null;
}
