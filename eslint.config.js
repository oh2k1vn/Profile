// @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    rules: {
      'import/order': [
        'error',
        {
          // 1. Chia nhóm import
          groups: [
            'builtin', // Node.js built-ins (fs, path...)
            'external', // Packages từ npm (lucide-react, react...)
            'internal', // Module nội bộ (được định nghĩa trong pathGroups bên dưới)
            ['parent', 'sibling'], // Các file cùng thư mục hoặc thư mục cha
            'index',
            'object',
            'type',
          ],

          // 2. Cấu hình để nhận diện @/ là internal
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],

          // Loại trừ react khỏi việc bị xử lý mặc định để đảm bảo nó luôn ở trên cùng
          pathGroupsExcludedImportTypes: ['react'],

          // 3. Tự động thêm dòng trống giữa các nhóm (giúp code dễ đọc)
          'newlines-between': 'always',

          // 4. Sắp xếp alphabet bên trong từng nhóm
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
]
