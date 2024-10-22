# Text2SQL Project

## Overview

The **Text2SQL** project allows users to input English queries and translates them into SQL queries. This is useful for users who may not have knowledge of SQL but need to retrieve or interact with data from a database. 

The system is designed with an **NLP-based backend** that processes user inputs, converts them into SQL queries, and returns the results, saving them in CSV format for easy consumption. The flow involves several components, including a rule-based Natural Language Processing (NLP) module and a validation mechanism to ensure accurate query translation.

## Features

- **User Input in Natural Language**: The user enters an English query.
- **NLP Conversion to SQL**: The query is passed to an NLP module, which parses the sentence and converts it into a valid SQL query.
- **Query Validation**: Before execution, the generated SQL query is validated to ensure correctness and safety.
- **Results**: The SQL query is executed, and the result is saved as a CSV file and provided to the user.
- **Feedback Loop**: In case the query cannot be converted or is invalid, the system provides feedback to the user.

## Frontend

The frontend component allows users to input their English queries and see the corresponding results.

- **Input form**: A simple input box where users can type in their English queries.
- **Display of SQL query**: The generated SQL query is displayed to the user for reference.
- **Downloadable CSV output**: Users can download the query results as a CSV file.

### Frontend Folder Structure:

```bash
frontend/
├── public/
│   ├── index.html          # Main HTML file
│   └── ...
├── src/
│   ├── components/
│   │   ├── QueryInput.js    # Input form for English queries
│   │   └── QueryResults.js  # Component to display SQL query and CSV download link
│   ├── styles/
│   │   └── style.css        # Styles for the frontend
│   └── App.js              # Main App component
├── package.json            # Dependencies and scripts
└── README.md               # Frontend specific readme
```

### Frontend Development Rules:

1. **Component Reusability**: Each feature should be developed in its own component, with minimal logic in the main `App.js` file.
2. **API Communication**: Use a service file to handle API communication between the frontend and backend.
3. **Styling**: Keep styles modular. Avoid inline styling and use CSS modules or a similar approach.
4. **Validation on Input**: Ensure some basic validation is done before the query is sent to the backend, such as checking that the input is not empty.

---

## Backend

The backend processes the user’s request, generates the SQL query from natural language, validates it, and sends back the results.

### Key Backend Components:

- **Server**: The server receives the English query from the frontend and interacts with the NLP and SQL components to generate the desired result.
- **NLP Engine**: Processes natural language input and translates it into a SQL query.
- **SQL Query Generation**: Converts the user's intent into an executable SQL query.
- **Query Validation**: Ensures that the generated SQL query is valid and secure before execution.
- **CSV Output**: After executing the query, results are saved to a CSV file and sent back to the user.

### Backend Folder Structure:

```bash
backend/
├── src/
│   ├── nlp/
│   │   ├── tokenizer.py      # Tokenization and parsing
│   │   └── rule_based.py     # Rule-based NLP component for SQL conversion
│   ├── validation/
│   │   └── sql_validator.py  # SQL validation logic
│   ├── database/
│   │   └── execute_query.py   # Code for executing SQL queries
│   ├── server.py             # API and request handling
│   └── utils/
│       └── file_saver.py     # Saves output to CSV format
├── tests/
│   ├── test_nlp.py           # Unit tests for NLP module
│   └── test_validation.py    # Unit tests for query validation
├── requirements.txt          # Dependencies for the backend (Python-based)
└── README.md                 # Backend specific readme
```

### Backend Development Rules:

1. **Modular Design**: Break logic into smaller, reusable modules. For instance, keep the NLP, validation, and query execution components separate.
2. **Error Handling**: Ensure robust error handling at each step of the pipeline (NLP, SQL conversion, and validation).
3. **Testing**: Every module should have unit tests written. For example, tests should be written for NLP parsing and SQL validation logic.
4. **Security**: Pay attention to SQL injection vulnerabilities, and use parameterized queries when executing SQL commands.
5. **Logging**: Ensure that every error is logged with sufficient detail, especially during SQL query generation and execution.

---

## Future Improvements

- **Machine Learning-based NLP**: The current system is rule-based. In the future, a machine learning-based NLP model can be introduced to improve the accuracy of SQL generation.
- **More Databases**: Support for databases beyond SQL (e.g., NoSQL).
- **Query Optimization**: Improve the SQL query generation process by introducing query optimization strategies.

---

## Setup

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend server:
   ```bash
   npm start
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows use `env\Scripts\activate`
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the backend server:
   ```bash
   python src/server.py
   ```

---

## Contribution Guidelines

1. **Follow the Folder Structure**: Always keep the code organized by adding new features in the appropriate folders.
2. **Code Reviews**: All changes should go through code reviews before being merged into the main branch.
3. **Write Tests**: Ensure that you write unit tests for each feature added or modified.
4. **Commit Messages**: Use clear and descriptive commit messages. For example: 
   - `feat: added tokenization module for NLP`
   - `fix: resolved SQL injection vulnerability in query validator`

---

## License

This project is licensed under the MIT License. See `LICENSE` for more details.

---

## Authors

- Aditya Singh
    * Project planning and management.
    * System design and presentation. 
  * Integration Testing and debugging.
- **Aditya Sangana**
    * User interface design 
    * Fronted development 
- M. L. Raghurama Datta 	
    * NLP (Text Processing)
    * Validation Testing
- Sandeep Nagalli 
    * Database Integration and management
    * Backend Application Server Implementation
