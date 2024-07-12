<?php
    use Psr\Http\Message\ResponseInterface as Response;
    use Psr\Http\Message\ServerRequestInterface as Request;
    
    $app->get('/member_show', function (Request $request, Response $response) {
        $conn = $GLOBALS['connect'];
        $sql = 'SELECT * FROM member';
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = array();
        foreach ($result as $row) {
            array_push($data, $row);
        }
    
        $response->getBody()->write(json_encode($data, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK));
        return $response
            ->withHeader('Content-Type', 'application/json; charset=utf-8')
            ->withStatus(200);
    });
    
    $app->put('/member_suspended/{id}', function (Request $request, Response $response, $args) {
        $id = $args['id']; // รับค่า id จาก URL
        $json = $request->getBody();
        $jsonData = json_decode($json, true);
        $conn = $GLOBALS['connect'];
    
        // ดำเนินการตรวจสอบว่าข้อมูลมีการยืนยันหรือไม่
        $member_status = 'N'; // ตั้งค่าเริ่มต้นเป็นไม่ยืนยัน
        if ($jsonData['member_status'] === 'Y') {
            $member_status = 'Y';
        }
    
        $sql = "UPDATE `member` SET `member_status` = ? WHERE `member`.`member_id` = ?";
    
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ss', $member_status, $id);
        $stmt->execute();
    
        $affected = $stmt->affected_rows;
        if ($affected > 0) {
            $data = ["affected_rows" => $affected];
            $response->getBody()->write(json_encode($data));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200);
        } else {
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500);
        }
    });
    
    $app->get('/member_pofile/{member_id}', function (Request $request, Response $response, $args) {
        $member_id = $args['member_id'];
        $conn = $GLOBALS['connect'];
        $sql = 'SELECT * FROM member WHERE member_id = ?';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('s', $member_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = [];
        while ($row = $result->fetch_assoc()) {
            array_push($data, $row);
        }
        $response->getBody()->write(json_encode($data, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK));
        return $response
            ->withHeader('Content-Type', 'application/json; charset=utf-8')
            ->withStatus(200);
    });

    $app->put('/edit_member/{member_id}', function (Request $request, Response $response, $args) {
        $member_id = $args['member_id']; // รับค่า id จาก URL
        $json = $request->getBody();
        $jsonData = json_decode($json, true);
        $conn = $GLOBALS['connect'];
    
        $sql = "UPDATE `member` SET `prefix` = ?, `firstname` = ?, `lastname` = ?, `email` = ?, `sex` = ?, `telephone_number` = ? WHERE `member`.`member_id` = ?";
    
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ssssssi', $jsonData['prefix'], $jsonData['firstname'], $jsonData['lastname'], $jsonData['email'], $jsonData['sex'], $jsonData['telephone_number'], $member_id);
        $stmt->execute();
    
        $affected = $stmt->affected_rows;
        if ($affected > 0) {
            $data = ["affected_rows" => $affected];
            $response->getBody()->write(json_encode($data));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200);
        } else {
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500);
        }
    });

    $app->post('/borrowing', function (Request $request, Response $response, $args) {
        $json = $request->getBody();
        $jsonData = json_decode($json, true);
        $conn = $GLOBALS['connect'];
    
        $sql = "INSERT INTO borrowing_returning (borrowing_returning_id, date_borrowing, borrowing_returning_status, member_id) VALUES (?, ?, ?, ?)";
    
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ssss', $jsonData['borrowing_returning_id'], $jsonData['order_date'], $jsonData['borrowing_returning_status'], $jsonData['member_id']);
        $stmt->execute();
    
        $affected = $stmt->affected_rows;
        if ($affected > 0) {
            $data = ["affected_rows" => $affected, "last_id" => $conn->insert_id];
            $response->getBody()->write(json_encode($data));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200);
        } else {
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500);
        }
    });
     

    $app->post('/list_order', function (Request $request, Response $response, $args) {
        $json = $request->getBody();
        $jsonData = json_decode($json, true);
        $conn = $GLOBALS['connect'];
    
        $sql = "INSERT INTO `order_borrow_return` (`equipmentlist_id`, `borrowing_returning_id`, `order_count`) VALUES (?, ?, ?);";
    
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ssi', $jsonData['equipmentlist_id'], $jsonData['borrowing_returning_id'], $jsonData['count']);
        $stmt->execute();
    
        $affected = $stmt->affected_rows;
        if ($affected > 0) {
            $data = ["affected_rows" => $affected, "last_id" => $conn->insert_id];
            $response->getBody()->write(json_encode($data));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200);
        } else {
            // บันทึกไม่สำเร็จ
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500);
        }
    });
    
    $app->get('/borrowing_returning/{member_id}', function (Request $request, Response $response, $args) {
        $member_id = $args['member_id'];
        $conn = $GLOBALS['connect'];
        $sql = 'SELECT * FROM borrowing_returning WHERE member_id = ?';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('s', $member_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = [];
        while ($row = $result->fetch_assoc()) {
            array_push($data, $row);
        }
        $response->getBody()->write(json_encode($data, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK));
        return $response
            ->withHeader('Content-Type', 'application/json; charset=utf-8')
            ->withStatus(200);
    });

    $app->put('/equipments_update_count/{equipmentlist_id}', function (Request $request, Response $response, $args) {
        $equipmentlist_id = $args['equipmentlist_id']; // รับค่า id จาก URL
        $json = $request->getBody();
        $jsonData = json_decode($json, true);
        $conn = $GLOBALS['connect'];
    
        $sql = "UPDATE `equipmentlist` SET `equipmentlist_count` = ? WHERE `equipmentlist`.`equipmentlist_id` = ?;
        ";
    
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('is', $jsonData['equipmentlist_count'], $equipmentlist_id);
        $stmt->execute();
    
        $affected = $stmt->affected_rows;
        if ($affected > 0) {
            $data = ["affected_rows" => $affected];
            $response->getBody()->write(json_encode($data));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200);
        } else {
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500);
        }
    });
    $app->get('/selections/{member_id}', function (Request $request, Response $response, $args) {
        $id = $args['member_id'];
        $conn = $GLOBALS['connect'];
        $sql = 'SELECT *
                FROM borrowing_returning
                INNER JOIN order_borrow_return ON borrowing_returning.borrowing_returning_id = order_borrow_return.borrowing_returning_id
                INNER JOIN equipmentlist ON order_borrow_return.equipmentlist_id = equipmentlist.equipmentlist_id
                INNER JOIN member ON borrowing_returning.member_id = member.member_id
                WHERE borrowing_returning.member_id = ?';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('s', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = [];
        
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
    $app->delete('/order_delete_auto/{order_id}', function (Request $request, Response $response, $args) {
        $order_id = $args['order_id']; // รับค่า id จาก URL
        $conn = $GLOBALS['connect'];
        $stmt = $conn->prepare("DELETE FROM order_borrow_return WHERE order_id = ?");
        $stmt->bind_param("i", $order_id);
        $stmt->execute();
        $result = $stmt->affected_rows;
    
        if ($result > 0) {
            // ลบสำเร็จ
            return $response
                ->withStatus(204); // 204 No Content
        } else {
            // ไม่พบรายการหรือมีข้อผิดพลาด
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(404);
        }
    });
    
    $app->get('/equipment_update/{id}', function (Request $request, Response $response, $args) {
        $id = $args['id'];
        $conn = $GLOBALS['connect'];
        $sql = 'SELECT * FROM order_borrow_return WHERE order_id = ?';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data = $row; // เก็บข้อมูล count ลงใน $data
        }
        // ตรงนี้เราต้องการให้ส่งค่า count กลับไปเท่านั้น
        $response->getBody()->write(json_encode($data, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK));
        return $response
            ->withHeader('Content-Type', 'application/json; charset=utf-8')
            ->withStatus(200);
    });
    

    $app->put('/order_selections_update_count/{equipmentlist_id}', function (Request $request, Response $response, $args) {
        $equipmentlist_id = $args['equipmentlist_id']; // รับค่า id จาก URL
        $json = $request->getBody();
        $jsonData = json_decode($json, true);
        $conn = $GLOBALS['connect'];
    
    
        $sql = "UPDATE `equipmentlist` SET `equipmentlist_count` = ? WHERE `equipmentlist`.`equipmentlist_id` = ?";
    
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('is', $jsonData['count'], $equipmentlist_id);
        $stmt->execute();
    
        $affected = $stmt->affected_rows;
        if ($affected > 0) {
            $data = ["affected_rows" => $affected];
            $response->getBody()->write(json_encode($data));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200);
        } else {
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500);
        }
    });

    $app->delete('/cancel_borrowing_returning/{borrowing_returning_id}', function (Request $request, Response $response, $args) {
        $borrowing_returning_id = $args['borrowing_returning_id']; // รับค่า id จาก URL
        $conn = $GLOBALS['connect'];
        $stmt = $conn->prepare("DELETE FROM borrowing_returning WHERE borrowing_returning_id = ?");
        $stmt->bind_param("s", $borrowing_returning_id);
        $stmt->execute();
        $result = $stmt->affected_rows;
    
        if ($result > 0) {
            // ลบสำเร็จ
            return $response
                ->withStatus(204); // 204 No Content
        } else {
            // ไม่พบรายการหรือมีข้อผิดพลาด
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(404);
        }
    });

    $app->post('/register_save', function (Request $request, Response $response, $args) {

        $json = $request->getBody();
        $jsonData = json_decode($json, true);
        $conn = $GLOBALS['connect'];
    
        $hashedPassword = password_hash($jsonData['password'], PASSWORD_DEFAULT);
    
        $sql = "INSERT INTO `member` (`prefix`, `firstname`, `lastname`, `email`, `password`, `sex`, `telephone_number`, `member_status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ssssssss', $jsonData['prefix'], $jsonData['firstname'], $jsonData['lastname'], $jsonData['email'], $hashedPassword, $jsonData['sex'], $jsonData['telephone_number'], $jsonData['member_status']);
        $stmt->execute();
    
        $affected = $stmt->affected_rows;
        if ($affected > 0) {
            $data = ["affected_rows" => $affected, "last_id" => $conn->insert_id];
            $response->getBody()->write(json_encode($data));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200);
        } else {
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500);
        }
    });
    
?>