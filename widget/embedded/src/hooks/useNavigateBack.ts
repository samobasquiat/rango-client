import type { NavigateOptions, Path } from 'react-router-dom';

import { useEffect, useRef } from 'react';
import { useInRouterContext, useLocation, useNavigate } from 'react-router-dom';

export function useNavigateTo(): (
  path: string | Partial<Path>,
  options?: NavigateOptions
) => void {
  const isRouterInContext = useInRouterContext();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = location.search;

  const navigateTo = (
    path: string | Partial<Path>,
    options?: NavigateOptions
  ): void => {
    if (isRouterInContext && typeof path === 'string') {
      path = `${path}${searchParams ? `/${searchParams}` : ''}`;
    }
    navigate(path, options);
  };

  return navigateTo;
}

export function useNavigateBack(): () => void {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = useRef(location.search);
  useEffect(() => {
    searchParams.current = location.search;
  }, [location.search]);
  return () => {
    navigate(-1);
  };
}
