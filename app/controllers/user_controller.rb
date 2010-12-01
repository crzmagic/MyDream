class UserController < ApplicationController
  protect_from_forgery :except => [:login]
  layout "standard", :except=> [:sign_up,:login,:logout]

  #浏览其他用户主页
  def home
    
  end

   #自己主页
  def myhome
    
  end

  #注册
  def sign_up
    return if request.get?
    
    @user = User.new(params[:user])
    if @user.save!
      session[:name] = @user.name
      redirect_to "/index"
    end
  end

  #登录
  def login
    return if request.get?

    user = User.login(params[:username],params[:password])
    if user
      session[:username] = user.name
      session[:favNumber] = 20
      if request.xhr?
        render :json=>"{\"loggedIn\":true}"
      else
        redirect_to "/index"
      end
      
    end
    
  end

  #退出
  def logout
    session[:username] = nil
    redirect_to "/index"
  end
end
