# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  def title_class(index)
    current = -1
    controller = request.path_parameters[:controller]
    action = request.path_parameters[:action]
    
    if controller == "home" and action == "myself" then
      current = 1
    end
    
    if index == current then
      return "current"
    else
      return ""
    end
  end
end
