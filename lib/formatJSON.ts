// Convert array of objects to pretty JSON string
export const formatJSON = (arr: any[]) => {
  return JSON.stringify(arr, null, 1); // 2 spaces indentation like Postman
}
