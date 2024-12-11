# Leaf Sense Article API

This API provides a service for managing educational articles related to plant care and diseases. It supports CRUD operations for articles, allowing users to retrieve, create, update, and delete content efficiently.

## Features

- Create new articles with detailed information about plant care and diseases.
- Retrieve a list of articles or a specific article by ID.
- Update existing articles to keep the content accurate and up-to-date.
- Delete articles that are no longer relevant.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)
- A database (e.g., MySQL) for storing article data

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/leaf-sense-article-api.git
   cd leaf-sense-article-api
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and add the necessary configuration variables, such as database connection details.

4. Start the server:

   ```bash
   npm start
   ```

## API Endpoints

### `GET /articles`

Retrieve a list of all articles.

#### Response

- **Success (200):**

  ```json
  {
      "status": "success",
      "data": [
          {
              "id": 1,
              "title": "How to Care for Tea Plants",
              "content": "Detailed guide on caring for tea plants.",
              "author": "John Doe",
              "created_at": "2024-12-01T12:00:00Z"
          },
          {
              "id": 2,
              "title": "Common Plant Diseases",
              "content": "Overview of common diseases in plants.",
              "author": "Jane Smith",
              "created_at": "2024-12-02T15:30:00Z"
          }
      ]
  }
  ```

### `GET /articles/:id`

Retrieve a specific article by its ID.

#### Response

- **Success (200):**

  ```json
  {
      "status": "success",
      "data": {
          "id": 1,
          "title": "How to Care for Tea Plants",
          "content": "Detailed guide on caring for tea plants.",
          "author": "John Doe",
          "created_at": "2024-12-01T12:00:00Z"
      }
  }
  ```

- **Failure (404):**

  ```json
  {
      "status": "fail",
      "message": "Article not found."
  }
  ```

### `POST /articles`

Create a new article.

#### Request

- **Content-Type**: `application/json`
- **Body**:

  ```json
  {
      "title": "How to Care for Tea Plants",
      "content": "Detailed guide on caring for tea plants.",
      "author": "John Doe"
  }
  ```

#### Response

- **Success (201):**

  ```json
  {
      "status": "success",
      "message": "Article created successfully.",
      "data": {
          "id": 1
      }
  }
  ```

### `PUT /articles/:id`

Update an existing article by its ID.

#### Request

- **Content-Type**: `application/json`
- **Body**:

  ```json
  {
      "title": "Updated Title",
      "content": "Updated content.",
      "author": "Jane Doe"
  }
  ```

#### Response

- **Success (200):**

  ```json
  {
      "status": "success",
      "message": "Article updated successfully."
  }
  ```

- **Failure (404):**

  ```json
  {
      "status": "fail",
      "message": "Article not found."
  }
  ```

### `DELETE /articles/:id`

Delete an article by its ID.

#### Response

- **Success (200):**

  ```json
  {
      "status": "success",
      "message": "Article deleted successfully."
  }
  ```

- **Failure (404):**

  ```json
  {
      "status": "fail",
      "message": "Article not found."
  }
  ```

## Error Handling

The API provides error responses with appropriate status codes and messages. Common error responses include:

- **400 Bad Request**: When the request body is invalid.
- **404 Not Found**: When the specified resource cannot be found.
- **500 Internal Server Error**: For unexpected errors during processing.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **Express** for building the API.
- **MySQL** for database management.
