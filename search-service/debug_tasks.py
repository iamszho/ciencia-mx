from meilisearch import Client
import json

client = Client('http://meilisearch:7700')
index = client.index('documents')

# Ver las últimas tareas
tasks = client.get_tasks({'limit': 10})
for task in tasks.results:
    if task.type == 'documentAdditionOrUpdate':
        print(f"\nTask {task.uid}:")
        print(f"  Status: {task.status}")
        print(f"  Type: {task.type}")
        if hasattr(task, 'error') and task.error:
            print(f"  Error: {json.dumps(task.error, indent=4)}")
        if hasattr(task, 'details') and task.details:
            print(f"  Details: {json.dumps(task.details.__dict__ if hasattr(task.details, '__dict__') else task.details, indent=4, default=str)}")

# Ver stats del índice
stats = index.get_stats()
print(f"\nIndex stats:")
print(f"  Documents: {stats.number_of_documents}")
print(f"  Is indexing: {stats.is_indexing}")
