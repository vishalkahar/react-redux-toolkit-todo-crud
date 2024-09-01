import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000'
    }),
    tagTypes: ['Tasks'],
    endpoints: (builder) => ({
        getTasks: builder.query({
            query: () => 'tasks',
            transformErrorResponse: (tasks) => tasks.reverse(),
            providesTags: ['Tasks'],
            async onQueryStarted(task, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    api.util.updateQueryData("getTasks", undefined, (draft) => {
                        draft.unshift({ id: crypto.randomUUID(), ...task });
                    }),
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
        addTask: builder.mutation({
            query: (task) => ({
                url: '/tasks',
                method: 'POST',
                body: task
            }),
            invalidatesTags: ['Tasks'],
            async onQueryStarted(task, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    api.util.updateQueryData("getTasks", undefined, (draft) => {
                        draft.unshift({ id: crypto.randomUUID(), ...task });
                    }),
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
        updateTask: builder.mutation({
            query: ({ id, ...updatedTask }) => ({
                url: `/tasks/${id}`,
                method: 'PATCH',
                body: updatedTask
            }),
            invalidatesTags: ['Tasks'],
            async onQueryStarted({ id, ...updatedTask }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    api.util.updateQueryData("getTasks", undefined, (tasksList) => {
                        const todoIndex = tasksList.findIndex((el) => el.id === id)
                        tasksList[todoIndex] = { ...tasksList[todoIndex], ...updatedTask }
                    }),
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
        deleteTask: builder.mutation({
            query: (id) => ({
                url: `/tasks/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Tasks'],
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    api.util.updateQueryData("getTasks", undefined, (tasksList) => {
                        const todoIndex = tasksList.findIndex((el) => el.id === id)
                        tasksList.splice(todoIndex, 1)
                    }),
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        })
    })
})

export const { useGetTasksQuery, useAddTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = api