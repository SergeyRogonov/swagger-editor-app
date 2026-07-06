export const DEFAULT_SCHEMA = `openapi: 3.0.3

info:
  title: Sample API
  description: Example OpenAPI specification loaded by default.
  version: 1.0.0

servers:
  - url: https://api.example.com

paths:
  /users:
    get:
      summary: Get all users
      operationId: getUsers

      responses:
        "200":
          description: Successful response

          content:
            application/json:
              schema:
                type: array

                items:
                  $ref: "#/components/schemas/User"

    post:
      summary: Create a user
      operationId: createUser

      requestBody:
        required: true

        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateUserRequest"

      responses:
        "201":
          description: User created

          content:
            application/json:
              schema:
                $ref: "#/components/schemas/User"

  /users/{id}:
    get:
      summary: Get user by ID
      operationId: getUserById

      parameters:
        - name: id
          in: path
          required: true

          schema:
            type: string

      responses:
        "200":
          description: User found

          content:
            application/json:
              schema:
                $ref: "#/components/schemas/User"

        "404":
          description: User not found

components:
  schemas:
    User:
      type: object

      properties:
        id:
          type: string

        name:
          type: string

        email:
          type: string
          format: email

      required:
        - id
        - name
        - email

    CreateUserRequest:
      type: object

      properties:
        name:
          type: string

        email:
          type: string
          format: email

      required:
        - name
        - email
`;
