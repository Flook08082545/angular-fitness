<?php
    use Psr\Http\Message\ResponseInterface as Response;
    use Psr\Http\Message\ServerRequestInterface as Request; 

    $app->get('/equipmentlist', function (Request $request, Response $response) {
        $conn = $GLOBALS['connect'];
        $sql = 'SELECT * FROM equipmentlist';
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = array();
    
        // Base URL for images
        // $baseUrl = 'http://localhost/fitness/api/uploads/';
        $baseUrl = '/fitness/api/uploads/';
    
        while ($row = $result->fetch_assoc()) {
            // Update the picture URL
            $row['equipmentlist_picture'] = $baseUrl . $row['equipmentlist_picture'];
            array_push($data, $row);
        }
    
        $response->getBody()->write(json_encode($data, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK));
        return $response
            ->withHeader('Content-Type', 'application/json; charset=utf-8')
            ->withStatus(200);
    });
    
    
    $app->get('/equipmentlist_search', function (Request $request, Response $response) {
        $conn = $GLOBALS['connect'];
        $sql = 'SELECT * FROM equipmentlist';
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = array();
        // Base URL for images
        // $baseUrl = 'http://localhost/fitness/api/uploads/';
        $baseUrl = '/fitness/api/uploads/';
    
        while ($row = $result->fetch_assoc()) {
            // Update the picture URL
            $row['equipmentlist_picture'] = $baseUrl . $row['equipmentlist_picture'];
            array_push($data, $row);
        }
    
        $response->getBody()->write(json_encode($data, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK));
        return $response
            ->withHeader('Content-Type', 'application/json; charset=utf-8')
            ->withStatus(200);
    });
    
    $app->get('/borrow_item/{equipmentlist_id}', function (Request $request, Response $response, $args) {
        $equipmentlist_id = $args['equipmentlist_id'];
        $conn = $GLOBALS['connect'];
        $sql = 'SELECT * FROM equipmentlist WHERE equipmentlist_id = ?';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('s', $equipmentlist_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = [];
        // Base URL for images
        // $baseUrl = 'http://localhost/fitness/api/uploads/';
        $baseUrl = '/fitness/api/uploads/';
    
        while ($row = $result->fetch_assoc()) {
            // Update the picture URL
            $row['equipmentlist_picture'] = $baseUrl . $row['equipmentlist_picture'];
            array_push($data, $row);
        }
        $response->getBody()->write(json_encode($data, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK));
        return $response
            ->withHeader('Content-Type', 'application/json; charset=utf-8')
            ->withStatus(200);
    });
    ?>