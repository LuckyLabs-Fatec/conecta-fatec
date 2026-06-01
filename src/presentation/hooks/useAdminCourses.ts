import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import http from '@/presentation/lib/http';

export type AdminCourse = {
  id: string;
  name: string;
  description?: string;
  active: boolean;
};

type CoursesResponse = {
  items: AdminCourse[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type AdminCourseUpdate = {
  id: string;
  name: string;
  description?: string;
};

const coursesQueryKey = ['admin-courses'] as const;

const listAllCourses = async (): Promise<AdminCourse[]> => {
  const firstPage = await http.get<CoursesResponse>('/courses', {
    params: { page: 1, limit: 100 },
  });
  const courses = [...firstPage.data.items];

  for (let nextPage = 2; nextPage <= firstPage.data.totalPages; nextPage += 1) {
    const page = await http.get<CoursesResponse>('/courses', {
      params: { page: nextPage, limit: 100 },
    });
    courses.push(...page.data.items);
  }

  return courses;
};

export const useAdminCourses = () => {
  const queryClient = useQueryClient();
  const coursesQuery = useQuery({
    queryKey: coursesQueryKey,
    queryFn: listAllCourses,
  });

  const updateCourseMutation = useMutation({
    mutationFn: async ({ id, ...data }: AdminCourseUpdate) => {
      const response = await http.put<AdminCourse>(`/courses/${id}`, data);
      return response.data;
    },
    onSuccess: (updatedCourse) => {
      queryClient.setQueryData<AdminCourse[]>(coursesQueryKey, (courses = []) => (
        courses.map((course) => (course.id === updatedCourse.id ? updatedCourse : course))
      ));
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: async (courseId: string) => {
      await http.delete(`/courses/${courseId}`);
      return courseId;
    },
    onSuccess: (deletedCourseId) => {
      queryClient.setQueryData<AdminCourse[]>(coursesQueryKey, (courses = []) => (
        courses.filter((course) => course.id !== deletedCourseId)
      ));
    },
  });

  return {
    courses: coursesQuery.data ?? [],
    isLoading: coursesQuery.isLoading,
    error: coursesQuery.error instanceof Error ? coursesQuery.error.message : null,
    updateCourse: updateCourseMutation.mutateAsync,
    updatingCourseId: updateCourseMutation.variables?.id ?? null,
    deleteCourse: deleteCourseMutation.mutateAsync,
    deletingCourseId: deleteCourseMutation.variables ?? null,
  };
};
