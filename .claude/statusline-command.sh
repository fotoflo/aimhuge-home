#!/usr/bin/env bash
# Claude Code statusLine command — minimal functional display

input=$(cat)
cwd=$(echo "$input" | jq -r '.workspace.current_dir // .cwd // empty')
model=$(echo "$input" | jq -r '.model.display_name // empty')
style=$(echo "$input" | jq -r '.output_style.name // empty')

# Git branch
branch=""
if [ -n "$cwd" ] && git -C "$cwd" rev-parse --git-dir > /dev/null 2>&1; then
    branch=$(git -C "$cwd" symbolic-ref --short HEAD 2>/dev/null \
        || git -C "$cwd" rev-parse --short HEAD 2>/dev/null)
fi

# Read task label from temp file (written by Stop hook)
task=""
if [ -f /tmp/claude-task-label.txt ]; then
    task=$(cat /tmp/claude-task-label.txt 2>/dev/null)
fi

# Build output: task | branch | model [style] | ctx: X%
parts=""

if [ -n "$task" ]; then
    parts="$task"
fi

if [ -n "$branch" ]; then
    if [ -n "$parts" ]; then
        parts="${parts} | ${branch}"
    else
        parts="$branch"
    fi
fi

if [ -n "$model" ]; then
    # Extract short name: strip leading "Claude " prefix, then strip trailing version numbers
    short_model=$(echo "$model" | sed 's/^Claude //I' | sed 's/ [0-9][0-9.]*$//')
    model_str="$short_model"
    if [ -n "$style" ] && [ "$style" != "default" ]; then
        model_str="${model_str} [${style}]"
    fi
    if [ -n "$parts" ]; then
        parts="${parts} | ${model_str}"
    else
        parts="$model_str"
    fi
fi

echo "$parts"
