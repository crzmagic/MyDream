class HomeController < ApplicationController
  layout "standard"

  def myself

    redirect_to :action=>"favorite"
  end

  def index
  end

  def review
  end

  def favorite
  end

  def photo
  end

  def video
  end

  def discovery
    @topics = Topic.find :all
  end

end
