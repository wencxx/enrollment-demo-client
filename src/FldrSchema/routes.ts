import { z } from 'zod'

export const grantSchema = z.object({
  groupCode: z.string({
    required_error: "Please select a group",
  }),
  objectName: z.string({
    required_error: "Please enter a path",
  }).min(1),
})

export const routeSchema = z.object({
  objectName: z.string({
    required_error: "Please select a group",
  }).min(3, "Route name must contain atleast 3 character(s)"),
  path: z.string({
    required_error: "Please enter a path",
  }).regex(/^\/.*/, "Route must start with '/'"),
})