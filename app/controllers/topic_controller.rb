class TopicController < ApplicationController
  protect_from_forgery
  
  def view
    @title = "MyDeam"
    
    return if request.get?

    #前台传入的变量作用说明
    #way：浏览方式：topic|general|stumblethru|instumbler|people|seen等
    #general： 完全随机浏览
    #contextual： 选择的具体的兴趣爱好
    #instumbler：浏览某人的兴趣爱好，此时contextual=某人nickname/fav
    #people: 随机浏览人
    #seen： 查看消息

    way = params[:way] || "general"
    v_contextual = params[:topic] || "All Topics"
    topics = Topic.find_by_sql "select * from topics order by rand() limit 1"
    topic = topics[0]
    topic.contextual = "All Topics"
    #topic.topic = "All Topics"
    topic.method = "general"
    topic.related_content = "supr_pub"
    topic.overlay = "{overlay:{url:http://www.baidu.com}}"

    logger.debug("@17$$topic_to_json = #{topic.to_json}")
    
    if way == "general" || way == "topic"  then
      render :json=>topic.to_json
    elsif way.include?("thumbDown") then
      #处理不喜欢请求
      render :json=>"{\"identical\":false}"
    elsif way.include?("unrate") then
      #由不喜欢变为喜欢请求处理
      render :json=>"{\"favorites\":\"42\"}"
    elsif way.include?("thumb") then
      #处理喜欢请求
      render :json=>"{\"identical\":false}"
    elsif way.include?("show_url") then
      #点“喜欢”的时候登录，然后刷新页面的请求
      topic.userdata = "{\"favorites\":\"45\",\"nickname\":\"" + session[:username] + "\",\"loggedIn\":true,\"prefetch\":false}}"
      render :json=>topic.to_json
    end
  end

  #
  def modalbox

  end
  
  #错误处理函数
  def error
    @error_msg = params[:id]
  end

end
