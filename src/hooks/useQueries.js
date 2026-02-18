import { useQuery } from '@tanstack/react-query';
import * as campusService from '@/services/campus';

export const useCampuses = () =>
  useQuery({
    queryKey: ['campuses'],
    queryFn: () => campusService.getCampuses().then((res) => res.data.data || []),
  });

export const useCampus = (campusId) =>
  useQuery({
    queryKey: ['campus', campusId],
    queryFn: () => campusService.getCampusById(campusId).then((res) => res.data.data),
    enabled: !!campusId,
  });
