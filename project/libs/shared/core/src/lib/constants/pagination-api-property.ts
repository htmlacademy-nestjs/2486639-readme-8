export const PaginationApiProperty = {
  TotalPages: {
    description: 'Total pages',
    example: 5
  },
  TotalItems: {
    description: 'Total items',
    example: 50
  },
  CurrentPage: {
    description: 'Current page',
    example: 1
  },
  ItemsPerPage: {
    description: 'Items per page',
    example: 10
  }
} as const;
