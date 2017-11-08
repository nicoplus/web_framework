# api_weibo.py
from utils import log
from routes import json_response
from models.weibo import  Weibo
from routes import current_user


def all(request):
    weibos = Weibo.all_json()
    log('weibos', weibos)
    return json_response(weibos)


def add(request):
    u = current_user(request)
    json = request.json()
    weibo = Weibo.new(json, u.id)
    return json_response(weibo.json())


def delete(request):
    weibo_id = int(request.query.get('id'))
    weibo = Weibo.delete(weibo_id)
    return json_response(weibo.json())


def update(request):
    form = request.json()
    weibo_id = int(form.get('id'))
    weibo = Weibo.update(weibo_id, form)
    return json_response(weibo.json())


def route_dict():
    d = {
        '/api/weibo/all': all,
        '/api/weibo/add': add,
        '/api/weibo/delete': delete,
        '/api/weibo/update': update,
    }
    return d