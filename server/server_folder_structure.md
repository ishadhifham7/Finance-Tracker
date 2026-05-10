/backend
├── src/
│ ├── config/
│ │ └── db.js
│ ├── middlewares/
│ │ ├── auth.middleware.js
│ │ ├── error.middleware.js
│ │ └── validate.middleware.js
│ ├── modules/
│ │ ├── auth/
│ │ │ ├── auth.controller.js
│ │ │ ├── auth.routes.js
│ │ │ ├── auth.service.js
│ │ │ └── auth.model.js
│ │ ├── transactions/
│ │ │ ├── transaction.controller.js
│ │ │ ├── transaction.routes.js
│ │ │ ├── transaction.service.js
│ │ │ └── transaction.model.js
│ │ ├── budgets/
│ │ │ ├── budget.controller.js
│ │ │ ├── budget.routes.js
│ │ │ ├── budget.service.js
│ │ │ └── budget.model.js
│ │ └── categories/
│ │ ├── category.controller.js
│ │ ├── category.routes.js
│ │ ├── category.service.js
│ │ └── category.model.js
│ ├── utils/
│ │ ├── apiError.js
│ │ └── constants.js
│ ├── app.js
│ └── server.js
├── .env
├── .gitignore
└── package.json
