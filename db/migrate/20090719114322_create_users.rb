class CreateUsers < ActiveRecord::Migration
  def self.up
    create_table :users do |t|
      t.text :email
      t.text :name
      t.text :nickname
      t.text :password
      t.text :gender
      t.date :birthday
      t.integer :favorites
      t.text :searchlinks
      t.text :allow_search
      t.boolean :loggedIn
      t.boolean :prefetch
      t.timestamps
    end
    
    User.create(:name=>"admin",:password=>"123456",:email=>"mymy828@gmail.com")
  end

  def self.down
    drop_table :users
  end
end
