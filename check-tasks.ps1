# Quick script to check tasks in database
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p864864 -e @"
USE todo_db;
SELECT '=== ALL TASKS ===' as '';
SELECT id, title, LEFT(description, 40) as description, completed, created_at FROM task ORDER BY created_at DESC;
SELECT '' as '';
SELECT '=== TASK SUMMARY ===' as '';
SELECT COUNT(*) as total_tasks, SUM(completed) as completed, SUM(NOT completed) as incomplete FROM task;
"@
