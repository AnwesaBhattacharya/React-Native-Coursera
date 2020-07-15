import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Button, Modal, StyleSheet} from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import Stars from 'react-native-stars';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (comment) => dispatch(postComment(comment))
})


function RenderDish(props) {

    const dish = props.dish;
    
        if (dish != null) {
            return(
                <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
                <Card
                featuredTitle={dish.name}
                image={{uri: baseUrl + dish.image}}>
                <Text style={{margin: 10}}>
                    {dish.description}
                </Text>
                <View style={{alignItems: 'center', flexDirection :'row' }}>
                <Icon
                    raised
                    reverse
                    name={ props.favorite ? 'heart' : 'heart-o'}
                    type='font-awesome'
                    color='#f50'
                    onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                    />
                <Icon
                    raised
                    reverse
                    name='pencil'
                    type='font-awesome'
                    color='#510D8B'
                    onPress={() => props.onPressComment()}
                    />
                </View>

            </Card>
            </Animatable.View>
            );
        }
        else {
            return(<View></View>);
        }
}

function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Stars
                    default={item.rating}
                    disable={true}
                    spacing={4}
                    starSize={5}
                    count={5}
                    fullStar={<Icon name='star' type='font-awesome' color='#F9E10A'/>}
                    emptyStar={<Icon name='star-o' type='font-awesome' />}
                />
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
        Animatable.View animation="fadeInUp" duration={2000} delay={1000}>        
        <Card title='Comments' >
            <FlatList 
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
                />
        </Card>
        </Animatable.View>
    );
}

class DishDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            favorites: [],
            showModal: false,
            rating: 4,
            author: '',
            comment: ''
        };
        this.toggleModal=this.toggleModal.bind(this);
        this.handleComment=this.handleComment.bind(this);
        this.handleModal=this.handleModal.bind(this);
    }

    static navigationOptions = {
        title: 'Dish Details'
    };


    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    handleModal(){
        this.setState({showModal: true});
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    
    handleComment(dishId) {
        this.toggleModal();
        this.props.postComment(dishId,this.state.rating,this.state.author,this.state.comment);

    }


    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        return(
            <ScrollView>
                <Modal animationType = {"slide"} transparent = {false}
                    visible = {this.state.showModal}
                    onDismiss = {() => this.toggleModal() }
                    onRequestClose = {() => this.toggleModal() }>
                <View style={styles.formRow}>
                <Rating
                    type='star'
                    ratingCount={5}
                    imageSize={60}
                    fractions={0}
                    readonly={false}
                    ratingColor ='#F9E10A'
                    minValue={0}
                    showRating
                    onFinishRating={(value) => this.setState({rating: value})}
                    />
                </View>
                <View style={styles.formRow}>
                <Input
                    placeholder='Author'
                    leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                    onChangeText={(text) => this.setState({author: text})}
                />
                </View>
                <View style={styles.formRow}>
                <Input
                    placeholder='Comment'
                    leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                    onChangeText={(text) => this.setState({comment: text})}
                />
                </View>
                <View style={styles.formRow}>
                <Button
                    onPress={() => this.handleComment(dishId)}
                    title="Submit"
                    color="#512DA8"
                    accessibilityLabel="Learn more about this purple button"
                    />
                </View>
                <View style={styles.formRow}>
                <Button
                    onPress={() => this.toggleModal()}
                    title="Cancel"
                    color="#512DA8"
                    accessibilityLabel="Learn more about this button"
                    />
                </View>
                </Modal>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    onPressComment={() => this.handleModal()} 
                    />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    formRow: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
      margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
       justifyContent: 'center',
       margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    },
    myStarStyle: {
    color: 'yellow',
    backgroundColor: 'transparent',
    textShadowColor: 'black',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
    },
    myEmptyStarStyle: {
    color: 'white',
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);