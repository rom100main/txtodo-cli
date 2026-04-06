# Commands

## Basic Commands

### list

List all todos.

```bash
txtodo list
```

### add

Add a new todo.

```bash
txtodo add "Task"
txtodo add 1 "Task inserted at position 1"
```

### insert

Insert a todo at a specific position.

```bash
txtodo insert 1 "Inserted task"
```

### update

Update a todo's text.

```bash
txtodo update 1 "Updated task"
```

### remove

Remove todos by index.

```bash
txtodo remove 1           # Single task
txtodo remove 1,2,3       # Multiple tasks
txtodo remove all         # All tasks
```

### mark

Mark todos as complete.

```bash
txtodo mark 1
txtodo mark 1,2,3
txtodo mark all
```

### unmark

Mark todos as incomplete.

```bash
txtodo unmark 1
txtodo unmark all
```

### search

Search todos by text (case-insensitive).

```bash
txtodo search "urgent"
```

## Filter & Sort

### filter

Filter todos by key:value or text.

```bash
txtodo filter project:Home        # Filter by project
txtodo filter context:@phone      # Filter by context
txtodo filter priority:A          # Filter by priority
txtodo filter completed:true      # Filter completed tasks
txtodo filter due:2024-01-16      # Filter by custom extension
txtodo filter "search text"       # Simple text filter
```

**Supported filter keys:**

- `project` / `projects` - Filter by project name
- `context` / `contexts` - Filter by context
- `priority` - Filter by priority level (A-Z)
- `completed` - Filter by completion status (true/false/yes/no/y/n)
- Any custom extension key (e.g., `due`, `estimate`)

### sort

Sort todos by key.

```bash
txtodo sort priority:ASC
txtodo sort priority:DESC
txtodo sort date:ASC
txtodo sort text:DESC
txtodo sort due:DESC              # Sort by custom extension
```

**Supported sort keys:**

- `priority` - Sort by priority (A-Z)
- `date` / `created` - Sort by creation date
- `text` / `description` - Sort alphabetically by description
- Any custom extension key

## Subtasks

### subtask

Add a subtask to a todo with indentation-based hierarchy.

```bash
txtodo subtask 1 "Child task"
txtodo subtask subtask 1 "Grandchild task"      # 2 levels deep
txtodo subtask subtask subtask 1 "Deep task"    # 3 levels deep
```

Each additional `subtask` keyword adds one level of indentation (4 spaces).

Maximum depth is parent indent + 4 levels.

## Skills

### skill

Create AI agent skill file at `./.agents/skills/txtodo/SKILL.md`.

```bash
txtodo skill        # Creates basic skill file
txtodo skill max    # Creates comprehensive skill file with full documentation
```

The skill file documents all CLI commands and usage patterns for AI agent integration.

## Help

### help

Show help information.

```bash
txtodo help
txtodo help markdown     # Output in markdown format
txtodo <command> --help  # Specific command help
```

## Advanced Usage

### Command Chaining

Chain query commands (search, filter, sort) with action commands (remove, mark, unmark, update, subtask, add, insert):

```bash
# Filter then remove
txtodo filter project:Home remove

# Search then update
txtodo search "urgent" update "new priority"

# Filter then add subtask
txtodo filter context:@phone subtask "call back"

# Multiple query commands then action
txtodo filter project:Home sort priority:ASC mark
```

**Chainable commands:** search, filter, sort, remove, mark, unmark, update, subtask, add, insert

### Index Format

All commands accept indices in these formats:

- **Single index:** `1`
- **Multiple indices:** `1,2,3`
- **All indices:** `all`

Indices are 1-based (first task is index 1).

### Interactive Mode

When arguments are missing, txtodo prompts for input:

```bash
txtodo add              # Prompts for task text
txtodo remove           # Prompts for indices
txtodo update           # Prompts for index and new text
txtodo search           # Prompts for search text
txtodo filter           # Prompts for filter expression
txtodo sort             # Prompts for sort expression
```

### Custom File Support

By default, txtodo works with `todo.txt` in the current directory. You can specify a different file:

```bash
txtodo ./work.txt list
txtodo /path/to/file.txt add "task"
txtodo ./personal.txt filter project:Home remove
```

If the file doesn't exist, it will be created automatically.

### Custom Extensions

The CLI supports custom key:value extensions with automatic type detection:

```
due:2024-01-16          # Date
estimate:2h             # Number/Duration
active:yes              # Boolean
tags:work,urgent        # Array
location:office         # String
```

Filter and sort by any extension:

```bash
txtodo filter due:2024-01-16
txtodo sort estimate:DESC
```

### todo.txt Format

```
(PRIORITY) DATE DESCRIPTION +PROJECT @CONTEXT key:value
```

Examples:

```
(A) 2024-01-15 Call Mom +Family @phone due:2024-01-16
(B) Schedule appointment +Work
x 2024-01-15 (A) 2024-01-14 Completed task
    Subtask with indentation (4 spaces)
        Nested subtask (8 spaces)
```
