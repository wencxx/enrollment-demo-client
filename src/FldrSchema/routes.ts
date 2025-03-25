import { z } from 'zod'

export const routeSchema = z.object({
  groupCode: z.string({
    required_error: "Please select a group",
  }),
  path: z.string({
    required_error: "Please enter a path",
  }).min(5),
})