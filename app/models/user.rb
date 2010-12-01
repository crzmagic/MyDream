class User < ActiveRecord::Base
  
  validates_presence_of [:email,:name,:password,:gender,:birthday]
  validates_format_of :email, :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i
  validates_uniqueness_of [:email,:name]

  def self.login(name, password)
    User.find(:first,:conditions=>["(email = ? or name = ?) and password = ?",name,name,password])
  end
end
