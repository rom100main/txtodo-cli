# Todo.txt MCP Server

A powerful CLI for managing todo.txt files with full support for priorities, projects, contexts, custom extensions, and hierarchical subtasks. Includes an MCP skill for AI agents.

## Features

- Task management commands (list, add, insert, remove, mark/unmark, update, sort, filter)
- Subtask support with indentation-based hierarchy
- Command chaining for powerful workflows
- Interactive prompts when arguments are missing
- Comprehensive error handling with specific error types
- AI agent skill

## Installation

```bash
npm install -g txtodo-cli
```

## Usage

The CLI works with `todo.txt` in your current directory by default.

```bash
txtodo list
txtodo add "Task"
txtodo insert 1 "Inserted task"
txtodo update 1 "Updated task"
txtodo remove 1
txtodo mark 1,2
txtodo unmark all
```

For full command documentation, see [DOCS.md](DOCS.md).

## Support

For bug reports and feature requests, please fill an issue at [GitHub repository](https://github.com/rom100main/txtodo-cli/issues).

## Changelog

See [CHANGELOG](CHANGELOG.md) for a list of changes in each version.

## Development

For development information, see [CONTRIBUTING](CONTRIBUTING.md).

## License

MIT
