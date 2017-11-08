# api_comment.py

from utils import log
from routes import json_response
from models.comment import Comment
from routes import current_user


def all(request):
    comments = Comment.all_json()
    return json_response(comments)


def add(request):
    form = request.json()
    u = current_user(request)
    c = Comment.new(form, u.id)
    return json_response(c.json())


def delete(request):
    comment_id = request.query.get('id')
    comment =  Comment.delete(comment_id)
    return json_response(comment.json())


def route_dict():
    d = {
        '/api/comment/all': all,
        '/api/comment/add': add,
        '/api/comment/delete': delete,
        # '/api/comment/update': update,
    }
    return d