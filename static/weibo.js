// weibo.js
var apiWeiboAll = function(callback) {
	var path = '/api/weibo/all'
	ajax('GET', path, '', callback)
}

var apiWeiboAdd = function(form, callback) {
	var path = '/api/weibo/add'
	ajax('POST', path, form, callback)
}

var apiWeiboDelete = function(id, callback) {
	var path = `/api/weibo/delete?id=${id}`
	ajax('GET', path, '', callback)
}

var apiWeiboUpdate = function(form, callback) {
	var path = '/api/weibo/update'
	ajax('POST', path, form, callback)
}

var apiCommentAll = function(callback) {
	var path = `/api/comment/all`
	ajax('GET', path, '', callback)
	
}

var apiCommentAdd = function(form, callback) {
	var path = '/api/comment/add'
	ajax('POST', path, form, callback)
}

var apiCommentDelete = function(id, callback) {
	var path = `/api/comment/delete?id=${id}`
	ajax('GET', path, '', callback)
}

var loadWeibos = function(){
    apiWeiboAll(function(r) {
    	// log('response',r)
    	var weibos = JSON.parse(r)
    	
    	for (var i = 0; i < weibos.length; i++) {
    		insertWeibo(weibos[i])
    	}
    	apiCommentAll(function(response){
    		var comments = JSON.parse(response)
    		for (var i = 0; i < comments.length; i++) {
    			var comment = comments[i]
    		
    			isnertComment(comment)
    		}
    	})
    })

}

var weiboTemplate = function(weibo) {
    var t = `
        <div class="weibo-cell">
            <span class="weibo-content" >${weibo.content}</span>
            <button data-id=${weibo.id} class='weibo-delete-button'>刪除</button>
            <button data-id=${weibo.id} class='weibo-edit-button'>編輯</button>
        </div>
        <div class="comment-list" data-weibo_id=${weibo.id}>
        	<input class="comment-add-input">
            <button class="comment-add-button">添加評論</button>
        </div>
    `
    return t
}

var weiboUpdateTemplate = function(todo_id) {
    var t = `
        <div class="weibo-update-form">
            <input class="weibo-update-input">
            <button data-id=${todo_id} class="weibo-update-button">更新</button>
        </div>
    `
    return t
}

var commentTemplate = function(comment) {
    var t = `
        <div class="comment-cell">
            <span class="comment-content" >${comment.content}</span>
            <button data-id=${comment.id} class='comemnt-delete-button'>刪除</button>
        </div>
 
    `
    return t
}

var isnertComment = function(comment) {
	var commentList = e(`.comment-list[data-weibo_id="${comment.weibo_id}"]`)
	var commentCell = commentTemplate(comment)
	log('commentList', commentList)
	commentList.insertAdjacentHTML('beforeend', commentCell)
}

var insertWeibo = function(weibo) {
	var weiboList = e('.weibo-list')
	var weiboCell = weiboTemplate(weibo)
	weiboList.insertAdjacentHTML('beforeend', weiboCell)
}

var bindEventWeiboAdd = function() {
	var add = e('#id-button-add')
	add.addEventListener('click', function(){
		var input = e('#id-input-weibo')
		var weibo = input.value
		// log('click add', weibo)
		var form = {
			content: weibo,
		}
		apiWeiboAdd(form, function(r){
			var weibo = JSON.parse(r)
			insertWeibo(weibo)
		})

	})
}

var bindEventWeiboDelete = function() {
	var weiboList = e('.weibo-list')
	weiboList.addEventListener('click', function(event) {
		var self = event.target
		if (self.classList.contains('weibo-delete-button')) {
			var weiboId = self.dataset.id
			log('delete', weiboId)
            apiCommentDelete(weiboId, function(respnse){
            	self.parentElement.remove()
            })
		} else {
			// log('點到了weibo-cell')
		}
	})
}

var bindEventWeiboUpdate = function() {
	var weiboList = e('.weibo-list')
	weiboList.addEventListener('click', function(event) {
		var self = event.target
		if (self.classList.contains('weibo-update-button')) {
            var weiboId = self.dataset.id
            var weiboCell = self.closest('.weibo-cell')
            var input = weiboCell.querySelector('.weibo-update-input')
            var form = {
            	id: weiboId,
            	content: input.value,
            }
            apiWeiboUpdate(form, function(response) {
            	var weiboForm = weiboCell.querySelector('.weibo-update-form')
            	weiboForm.remove()
            	weibo = JSON.parse(response)
            	var weiboContent = weiboCell.querySelector('.weibo-content')
            	weiboContent.innerText = weibo.content
            })
		} else {

		}
	})

}

var bindEventWeiboEdit = function() {
	var weiboList = e('.weibo-list')
	weiboList.addEventListener('click', function(event) {
		var self = event.target;
		if (self.classList.contains('weibo-edit-button')) {
			var weiboId = self.dataset.id;
            var updateInput = weiboUpdateTemplate(weiboId);
            self.parentElement.insertAdjacentHTML('beforeend', updateInput);
		} else {
			// log('點到了weibo-cell');
		}
	});	
};


var bindEventCommentAdd = function() {
	var weiboList = e('.weibo-list')
	weiboList.addEventListener('click', function(event) {
		var self = event.target
		if (self.classList.contains('comment-add-button')) {
			var commentList = self.parentElement
			var weiboId = commentList.dataset.weibo_id
			var commentContent = commentList.querySelector('.comment-add-input').value
			var form = {
				content: commentContent,
				weibo_id: weiboId,
			}
			apiCommentAdd(form, function(response){
				var comment = JSON.parse(response)
				isnertComment(comment)
			})
		} 
	
	})
}

var bindEventCommentDelete = function(){
	var commentList = e('.weibo-list')
	commentList.addEventListener('click', function(event) {
		var self = event.target
		if (self.classList.contains('comemnt-delete-button')) {
			var commentId = self.dataset.id
			log('delete', commentId)
            apiWeiboDelete(commentId, function(respnse){
            	self.parentElement.remove()
            })
		} else {
			// log('點到了weibo-cell')
		}
	})
}
var bindEvents = function(){
     bindEventWeiboAdd()
     bindEventWeiboDelete()
     bindEventWeiboUpdate()
     bindEventWeiboEdit()
     bindEventCommentAdd()
     bindEventCommentDelete()
};

var __main = function(){
    bindEvents()
    loadWeibos()
};

__main()