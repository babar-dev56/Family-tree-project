# Family Tree API - Parent-Child Relationships

This guide explains how to use the parent-child relationship features in your Family Tree API.

## Database Schema

Before using the parent-child features, you need to run the migration to add the `parent_id` column:

```bash
npx knex migrate:latest
```

If you need to reset the schema:

```bash
npx knex migrate:rollback
```

## Adding a Member with Parent

You can now add a member with an optional `parent_id` to establish parent-child relationships.

### Request:
```bash
POST /members
Content-Type: application/json

{
    "name": "John Doe",
    "age": 8,
    "gender": "Male",
    "parent_id": 1
}
```

### Response:
```json
{
    "success": true,
    "message": "Member added successfully",
    "id": 2
}
```

## New API Endpoints

### 1. Get All Children of a Member
Get all children of a specific member (grandparents, parents, etc.)

```bash
GET /members/:id/children
```

**Example:**
```bash
GET /members/1/children
```

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 2,
            "name": "John Doe",
            "age": 8,
            "gender": "Male",
            "parent_id": 1,
            "created_at": "2024-01-01T10:00:00Z",
            "updated_at": "2024-01-01T10:00:00Z"
        },
        {
            "id": 3,
            "name": "Jane Doe",
            "age": 6,
            "gender": "Female",
            "parent_id": 1,
            "created_at": "2024-01-02T10:00:00Z",
            "updated_at": "2024-01-02T10:00:00Z"
        }
    ]
}
```

### 2. Get Parent of a Member
Get the parent of a specific member.

```bash
GET /members/:id/parent
```

**Example:**
```bash
GET /members/2/parent
```

**Response:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Robert Doe",
        "age": 45,
        "gender": "Male",
        "parent_id": null,
        "created_at": "2023-12-01T10:00:00Z",
        "updated_at": "2023-12-01T10:00:00Z"
    }
}
```

If the member has no parent, the response will be:
```json
{
    "success": true,
    "data": null
}
```

### 3. Get Member with Full Family Tree
Get a member with their parent and all children (useful for displaying family relationships).

```bash
GET /members/:id/family
```

**Example:**
```bash
GET /members/1/family
```

**Response:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Robert Doe",
        "age": 45,
        "gender": "Male",
        "parent_id": null,
        "created_at": "2023-12-01T10:00:00Z",
        "updated_at": "2023-12-01T10:00:00Z",
        "parent": null,
        "children": [
            {
                "id": 2,
                "name": "John Doe",
                "age": 8,
                "gender": "Male",
                "parent_id": 1,
                "created_at": "2024-01-01T10:00:00Z",
                "updated_at": "2024-01-01T10:00:00Z"
            },
            {
                "id": 3,
                "name": "Jane Doe",
                "age": 6,
                "gender": "Female",
                "parent_id": 1,
                "created_at": "2024-01-02T10:00:00Z",
                "updated_at": "2024-01-02T10:00:00Z"
            }
        ]
    }
}
```

## Usage Examples

### Example 1: Create a Family Tree
```bash
# 1. Create grandparent
POST /members
{
    "name": "George Smith",
    "age": 70,
    "gender": "Male"
}
# Response: id = 1

# 2. Create parent (child of grandparent)
POST /members
{
    "name": "Robert Doe",
    "age": 45,
    "gender": "Male",
    "parent_id": 1
}
# Response: id = 2

# 3. Create children
POST /members
{
    "name": "John Doe",
    "age": 15,
    "gender": "Male",
    "parent_id": 2
}
# Response: id = 3

POST /members
{
    "name": "Jane Doe",
    "age": 12,
    "gender": "Female",
    "parent_id": 2
}
# Response: id = 4
```

### Example 2: Query Family Relationships
```bash
# Get all children of Robert (id=2)
GET /members/2/children
# Returns: [John (id=3), Jane (id=4)]

# Get parent of John (id=3)
GET /members/3/parent
# Returns: Robert (id=2)

# Get full family tree for Robert
GET /members/2/family
# Returns: Robert with parent George and children John & Jane
```

## Model Relationships

The Member model now has relationships defined:

- **parent**: References the parent member (if `parent_id` is set)
- **children**: All members that have this member as their parent

These relationships can be used with Objection.js eager loading and querying.

## Database Schema

The members table now has:

```sql
ALTER TABLE members ADD COLUMN parent_id INT UNSIGNED NULL;
ALTER TABLE members ADD FOREIGN KEY (parent_id) REFERENCES members(id) ON DELETE SET NULL;
```

**Key Points:**
- `parent_id` is nullable (root ancestors have no parent)
- Foreign key constraint ensures data integrity
- ON DELETE SET NULL ensures child records aren't deleted if parent is deleted

## Notes

- A member can have only one parent (as `parent_id` is a single field)
- Circular references are possible but not recommended (e.g., A → B → A)
- Use `parent_id = null` for root ancestors
- The relationship is unidirectional (parent_id points to parent, but child records aren't deleted with parent)
