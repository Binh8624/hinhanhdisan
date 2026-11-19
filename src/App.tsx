import React, { useCallback, useEffect, useState } from 'react';
import type { AppRoute } from './types/heritage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HeritageProvider } from './context/HeritageContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ArchivePage } from './pages/ArchivePage';
import { RecordDetailPage } from './pages/RecordDetailPage';
import { RightsManagementPage } from './pages/RightsManagementPage';
import { ConsentLicensesPage } from './pages/ConsentLicensesPage';
import { VersionsComparisonPage } from './pages/VersionsComparisonPage';
import { RightsCheckerPage } from './pages/RightsCheckerPage';
import { UsageRequestPage } from './pages/UsageRequestPage';
import { TakedownComplaintPage } from './pages/TakedownComplaintPage';
import { SourcesPage } from './pages/SourcesPage';
import { LegalHandbookPage } from './pages/LegalHandbookPage';
import { GeminiAssistantPage } from './pages/GeminiAssistantPage';
import { AboutPage } from './pages/AboutPage';
import { SelfAuditReportPage } from './pages/SelfAuditReportPage';

const VALID_ROUTES: AppRoute[] = [
  '/',
  '/tra-cuu',
  '/tu-lieu',
  '/quyen-so-huu',
  '/su-dong-y',
  '/ban-goc-ban-sao',
  '/kiem-tra-quyen',
  '/yeu-cau-su-dung',
  '/khieu-nai-go-bo',
  '/nguon-tu-lieu',
  '/cam-nang-phap-ly',
  '/tro-ly-ai',
  '/gioi-thieu',
  '/bao-cao-kiem-thu',
];

const ROUTE_ALIASES: Record<string, AppRoute> = {
  '/kho-tu-lieu': '/tra-cuu',
  '/huong-dan-xin-phep': '/yeu-cau-su-dung',
};

function parseLocation(): { route: AppRoute; recordId: string | null } {
  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const idParam = params.get('id');

  // Support clean /tu-lieu/<id> as well as /tu-lieu?id=<id>
  if (path.startsWith('/tu-lieu/')) {
    const slugId = decodeURIComponent(path.slice('/tu-lieu/'.length));
    return { route: '/tu-lieu', recordId: slugId || idParam };
  }

  if (ROUTE_ALIASES[path]) {
    return { route: ROUTE_ALIASES[path], recordId: idParam };
  }

  const matched = VALID_ROUTES.find((r) => r === path);
  return {
    route: matched ?? '/',
    recordId: idParam,
  };
}

export default function App() {
  const [{ route, recordId }, setNavState] = useState<{
    route: AppRoute;
    recordId: string | null;
  }>(() => parseLocation());

  useEffect(() => {
    const onPopState = () => {
      setNavState(parseLocation());
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleNavigate = useCallback((nextRoute: AppRoute, nextRecordId?: string) => {
    const cleanId = nextRecordId ?? null;
    const url =
      nextRoute === '/tu-lieu' && cleanId
        ? `/tu-lieu?id=${encodeURIComponent(cleanId)}`
        : nextRoute;
    if (window.location.pathname + window.location.search !== url) {
      window.history.pushState(null, '', url);
    }
    setNavState({ route: nextRoute, recordId: cleanId });
  }, []);

  const renderPage = () => {
    switch (route) {
      case '/':
        return <HomePage onNavigate={handleNavigate} />;
      case '/tra-cuu':
        return <ArchivePage onNavigate={handleNavigate} />;
      case '/tu-lieu':
        return <RecordDetailPage recordId={recordId} onNavigate={handleNavigate} />;
      case '/quyen-so-huu':
        return <RightsManagementPage onNavigate={handleNavigate} />;
      case '/su-dong-y':
        return <ConsentLicensesPage onNavigate={handleNavigate} />;
      case '/ban-goc-ban-sao':
        return <VersionsComparisonPage onNavigate={handleNavigate} />;
      case '/kiem-tra-quyen':
        return <RightsCheckerPage onNavigate={handleNavigate} />;
      case '/yeu-cau-su-dung':
        return <UsageRequestPage onNavigate={handleNavigate} />;
      case '/khieu-nai-go-bo':
        return <TakedownComplaintPage onNavigate={handleNavigate} />;
      case '/nguon-tu-lieu':
        return <SourcesPage onNavigate={handleNavigate} />;
      case '/cam-nang-phap-ly':
        return <LegalHandbookPage onNavigate={handleNavigate} />;
      case '/tro-ly-ai':
        return <GeminiAssistantPage onNavigate={handleNavigate} />;
      case '/gioi-thieu':
        return <AboutPage onNavigate={handleNavigate} />;
      case '/bao-cao-kiem-thu':
        return <SelfAuditReportPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <ErrorBoundary>
      <HeritageProvider>
        <Layout currentRoute={route} onNavigate={handleNavigate}>
          {renderPage()}
        </Layout>
      </HeritageProvider>
    </ErrorBoundary>
  );
}
