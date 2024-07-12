<?php
    use Psr\Http\Message\ResponseInterface as Response;
    use Psr\Http\Message\ServerRequestInterface as Request; 

    $app->post('/login_member', function (Request $request, Response $response) {
        $conn = $GLOBALS['connect'];
        $data = json_decode($request->getBody(), true);
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
    
        // Check if email and password are provided
        if (!empty($email) && !empty($password)) {
            $sql = 'SELECT * FROM member WHERE email = ?';
            $stmt = $conn->prepare($sql);
            $stmt->bind_param('s', $email);
            $stmt->execute();
            $result = $stmt->get_result();
    
            if ($result->num_rows > 0) {
                $data = $result->fetch_assoc();
    
                // Verify the password
                if (password_verify($password, $data['password'])) {
                    // Login successful
                    $response->getBody()->write(json_encode(['success' => true, 'data' => $data], JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK));
                    return $response->withHeader('Content-Type', 'application/json; charset=utf-8')->withStatus(200);
                } else {
                    // Invalid password
                    $response->getBody()->write(json_encode(['success' => false, 'message' => 'Invalid email or password'], JSON_UNESCAPED_UNICODE));
                    return $response->withHeader('Content-Type', 'application/json; charset=utf-8')->withStatus(401);
                }
            } else {
                // Email not found
                $response->getBody()->write(json_encode(['success' => false, 'message' => 'Invalid email or password'], JSON_UNESCAPED_UNICODE));
                return $response->withHeader('Content-Type', 'application/json; charset=utf-8')->withStatus(401);
            }
        } else {
            // Email or password not provided
            $response->getBody()->write(json_encode(['success' => false, 'message' => 'Email and password are required'], JSON_UNESCAPED_UNICODE));
            return $response->withHeader('Content-Type', 'application/json; charset=utf-8')->withStatus(400);
        }
    });
    

    $app->post('/login_admin', function (Request $request, Response $response) {
        $conn = $GLOBALS['connect'];
        $data = json_decode($request->getBody(), true);
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
    
        if (!empty($email) && !empty($password)) {
            $sql = 'SELECT * FROM admin WHERE email = ?';
            $stmt = $conn->prepare($sql);
            $stmt->bind_param('s', $email);
            $stmt->execute();
            $result = $stmt->get_result();
    
            if ($result->num_rows > 0) {
                $data = $result->fetch_assoc();
    
                // Verify the password
                if (password_verify($password, $data['password'])) {
                    // Login successful
                    $response->getBody()->write(json_encode(['success' => true, 'data' => $data], JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK));
                    return $response->withHeader('Content-Type', 'application/json; charset=utf-8')->withStatus(200);
                } else {
                    // Invalid password
                    $response->getBody()->write(json_encode(['success' => false, 'message' => 'Invalid email or password'], JSON_UNESCAPED_UNICODE));
                    return $response->withHeader('Content-Type', 'application/json; charset=utf-8')->withStatus(401);
                }
            } else {
                // Email not found
                $response->getBody()->write(json_encode(['success' => false, 'message' => 'Invalid email or password'], JSON_UNESCAPED_UNICODE));
                return $response->withHeader('Content-Type', 'application/json; charset=utf-8')->withStatus(401);
            }
        } else {
            $response->getBody()->write(json_encode(['success' => false, 'message' => 'Email and password are required'], JSON_UNESCAPED_UNICODE));
            return $response->withHeader('Content-Type', 'application/json; charset=utf-8')->withStatus(400);
        }
    });
    
    // $app->post('/login_admin', function (Request $request, Response $response) {
    //     $conn = $GLOBALS['connect'];
    //     $data = json_decode($request->getBody(), true);
    //     $email = $data['email'] ?? '';
    //     $password = $data['password'] ?? '';
    
    //     // Check if email and password are provided
    //     if (!empty($email) && !empty($password)) {
    //         $sql = 'SELECT * FROM admin WHERE email = ? AND password = ?';
    //         $stmt = $conn->prepare($sql);
    //         $stmt->bind_param('ss', $email, $password);
    //         $stmt->execute();
    //         $result = $stmt->get_result();
    
    //         if ($result->num_rows > 0) {
    //             // Login successful
    //             $data = $result->fetch_assoc();
    //             $response->getBody()->write(json_encode(['success' => true, 'data' => $data], JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK));
    //             return $response->withHeader('Content-Type', 'application/json; charset=utf-8')->withStatus(200);
    //         } else {
    //             // Login failed
    //             $response->getBody()->write(json_encode(['success' => false, 'message' => 'Invalid email or password'], JSON_UNESCAPED_UNICODE));
    //             return $response->withHeader('Content-Type', 'application/json; charset=utf-8')->withStatus(401);
    //         }
    //     } else {
    //         // Email or password not provided
    //         $response->getBody()->write(json_encode(['success' => false, 'message' => 'Email and password are required'], JSON_UNESCAPED_UNICODE));
    //         return $response->withHeader('Content-Type', 'application/json; charset=utf-8')->withStatus(400);
    //     }
    // });
?>
