class CreateTopics < ActiveRecord::Migration
  def self.up
    create_table :topics do |t|
      t.text :url
      t.text :title
      t.integer :numreviews
      t.string :thumb
      t.string :discoverer
      t.string :discoverer_nick
      t.string :discoverer_pic
      t.string :category
      t.text :topic
      t.integer :stars
      t.text :contextual
      t.string :info_link
      t.boolean :url_status
      t.string :publicid
      t.string :rating
      t.string :method
      t.timestamps
    end
    
    Topic.create(:url => "http://www.baidu.com", :title => "www.baidu.com")
  end

  def self.down
    drop_table :topics
  end
end
