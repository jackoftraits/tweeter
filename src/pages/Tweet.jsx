import React, { Fragment, useState, useEffect } from 'react';
import { Button, Container, Row, Col, Form, Card } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useCookies } from 'react-cookie';
import { Redirect } from "react-router-dom";

const axios = require('axios');
const moment = require('moment');

export default function Tweet() {
    const [cookies, setCookie, removeCookie] = useCookies(['userId']);
    const [tweet, setTweet] = useState("");
    const [tweetList, setTweetList] = useState([{}]);
        
    const getList = () => {
        axios.get('http://localhost:3005/tweets/user/' + cookies.userId)
        .then((res) => {
            if (res) {
                setTweetList(res.data);
            }
        });       
    }
       
    useEffect(() => {
        getList();
    }, []);

    // Redirect if not logged in
    if (!cookies.userId) {       
        return <Redirect to="/login" />
    }

    // When the value changes for the text area
    const handleChange = (event) => {
        setTweet(event && event.target.value ? event.target.value:"");
    };

    // Save tweet
    const save = async () => {
        if (tweet) { 
            axios.post('http://localhost:3005/tweets', {
                user_id: cookies.userId,
                content: tweet
            })
            .then(async (res) => {
                await getList();
                setTweet(null);
            });
        }       
    }

    // Remove tweet
    const remove = async (id) => {
        console.log(id)
        axios.delete('http://localhost:3005/tweets/' + id)
        .then(async (res) => {
            await getList();
        });
    }    
    
    return (       
        <Fragment>           
            <Helmet>
                <meta charSet="utf-8" />
                <title>Tweet</title>
            </Helmet>       
            <Container>
                <Row>            
                    <Col>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Tweet</Form.Label>
                            <Form.Control as="textarea" rows="3" value={tweet || ""} onChange={handleChange} />
                        </Form.Group>
                        <Button variant="primary" type="button" onClick={save}>
                            Post tweet!
                        </Button> 
                        <br/><br/>                    
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h2>Tweets</h2>                        
                            {tweetList.length && tweetList.map((item, index) => {
                                return (
                                    <Card key={index} style={{ width: '18rem' }}>
                                        <Card.Body>  
                                            <Card.Subtitle className="mb-2 text-muted">{moment(item.date_time).format('LLL')}</Card.Subtitle>                                 
                                            <Card.Text>{item.content}</Card.Text>
                                            <Button variant="danger" size="sm" data-id={item.id} onClick={() => remove(item.id)} >Delete</Button>
                                        </Card.Body>
                                    </Card>
                                )
                            })} 
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
}

