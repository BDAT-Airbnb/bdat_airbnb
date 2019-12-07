
def bar_chart():
    room_type = request.args.get('room_type')
    neighbourhood = list(mongo.db.metrics.aggregate(
        [{"$match": {"room_type": room_type}}, {"$group": {"_id": "$neighbourhood", "count": {"$sum": 1}}},
         {"$sort": {"count": -1}}, {"$limit": 10}]))
    label = []
    data = []
    for item in neighbourhood:
        label.append(item.get('_id'))
        data.append(item.get('count'))
    room_types = list(mongo.db.metrics.aggregate([{"$group": {"_id": "$room_type"}}]))
    room_types_list = []
    for room_type in room_types:
        room_types_list.append(room_type["_id"])
    response = {"label": label, "data": data, "room_types": room_types_list}
    return response
