require 'test_helper'

class TopicControllerTest < ActionController::TestCase
  test "should get nextone" do
    get :nextone
    assert_response :success
  end

end
