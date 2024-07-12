<?php
    use Psr\Http\Message\ResponseInterface as Response;
    use Psr\Http\Message\ServerRequestInterface as Request; 
    
    $app->get('/admin_show', function (Request $request, Response $response) {
        $conn = $GLOBALS['connect'];
        $sql = 'SELECT * FROM admin';
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

    $app->put('/admin_suspended/{id}', function (Request $request, Response $response, $args) {
        $id = $args['id']; // รับค่า id จาก URL
        $json = $request->getBody();
        $jsonData = json_decode($json, true);
        $conn = $GLOBALS['connect'];
    
        // ดำเนินการตรวจสอบว่าข้อมูลมีการยืนยันหรือไม่
        $approval_status = 'N'; // ตั้งค่าเริ่มต้นเป็นไม่ยืนยัน
        if ($jsonData['approval_status'] === 'Y') {
            $approval_status = 'Y';
        }
    
        $sql = "UPDATE `member` SET `approval_status` = ? WHERE `member`.`member_id` = ?;
        ";
    
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('si', $approval_status, $id);
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

    $app->get('/order_borrowing_returning', function (Request $request, Response $response) {
        $conn = $GLOBALS['connect'];
        
        // Get the member_id from the query parameters, if it exists
        $member_id = $request->getQueryParams()['member_id'] ?? null;
        
        // Base SQL query
        $sql = 'SELECT *
                FROM borrowing_returning
                INNER JOIN order_borrow_return ON borrowing_returning.borrowing_returning_id = order_borrow_return.borrowing_returning_id
                INNER JOIN equipmentlist ON order_borrow_return.equipmentlist_id = equipmentlist.equipmentlist_id
                INNER JOIN member ON borrowing_returning.member_id = member.member_id';
        
        // Modify the query if member_id is provided
        if ($member_id) {
            $sql .= ' WHERE member.member_id = ?';
        }
        
        $stmt = $conn->prepare($sql);
        
        // Bind the member_id parameter if it's provided
        if ($member_id) {
            $stmt->bind_param('i', $member_id);
        }
        
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
    
    
        $app->put('/order_selections_update/{borrowing_returning_id}', function (Request $request, Response $response, $args) {
    $borrowing_returning_id = $args['borrowing_returning_id']; // รับค่า id จาก URL
    $json = $request->getBody();
    $jsonData = json_decode($json, true);
    $conn = $GLOBALS['connect'];

    // ดำเนินการตรวจสอบว่าข้อมูลมีการยืนยันหรือไม่
    $borrowing_returning_status = 'N'; // ตั้งค่าเริ่มต้นเป็นไม่ยืนยัน
    if ($jsonData['borrowing_returning_status'] === 'Y') {
        $borrowing_returning_status = 'Y';
    }

    $sql = "UPDATE `borrowing_returning` SET `borrowing_returning_status` = ? WHERE `borrowing_returning`.`borrowing_returning_id` = ?;
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ss', $borrowing_returning_status, $borrowing_returning_id);
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


$app->get('/orderreturn', function (Request $request, Response $response) {
    $conn = $GLOBALS['connect'];
    $sql = 'SELECT *
    FROM borrowing_returning
    INNER JOIN order_borrow_return ON borrowing_returning.borrowing_returning_id = order_borrow_return.borrowing_returning_id
    INNER JOIN equipmentlist ON order_borrow_return.equipmentlist_id = equipmentlist.equipmentlist_id
    INNER JOIN member ON borrowing_returning.member_id = member.member_id';
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

$app->put('/order_return_update/{borrowing_returning_id}', function (Request $request, Response $response, $args) {
    $borrowing_returning_id = $args['borrowing_returning_id'];
    $json = $request->getBody();
    $jsonData = json_decode($json, true);
    $conn = $GLOBALS['connect'];

    // ดำเนินการตรวจสอบว่าข้อมูลมีการยืนยันหรือไม่
    $borrowing_returning_status = 'N'; // ตั้งค่าเริ่มต้นเป็นไม่ยืนยัน
    if ($jsonData['selectedOrder_return'] === 'Y') {
        $borrowing_returning_status = 'Y';
    }

    $sql = "UPDATE `borrowing_returning` SET `date_returning` = ?, `borrowing_returning_status` = ? WHERE `borrowing_returning`.`borrowing_returning_id` = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sss', $jsonData['formattedDate'], $borrowing_returning_status, $borrowing_returning_id);
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

$app->put('/order_return_update_count/{id}', function (Request $request, Response $response, $args) {
    $id = $args['id']; // รับค่า id จาก URL
    $json = $request->getBody();
    $jsonData = json_decode($json, true);
    $conn = $GLOBALS['connect'];

    $sql = "UPDATE `equipmentlist` SET `equipmentlist_count` = ? WHERE `equipmentlist`.`equipmentlist_id` = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param('is', $jsonData['order_count'], $id);
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

$app->post('/add_admin_new', function (Request $request, Response $response, $args) {

    $json = $request->getBody();
    $jsonData = json_decode($json, true);
    $conn = $GLOBALS['connect'];

        // Check for duplicate email
        $checkEmailSql = "SELECT COUNT(*) AS count FROM `admin` WHERE `email` = ?";
        $checkStmt = $conn->prepare($checkEmailSql);
        $checkStmt->bind_param('s', $jsonData['email']);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result()->fetch_assoc();
    
        if ($checkResult['count'] > 0) {
            $data = ["error" => "Email already exists"];
            $response->getBody()->write(json_encode($data));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(400); // Bad Request
        }

    $hashedPassword = password_hash($jsonData['password'], PASSWORD_DEFAULT);

    $sql = "INSERT INTO `admin` (`prefix`, `firstname`, `lastname`, `email`, `password`, `sex`, `telephone_number`) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssssssi', $jsonData['prefix'], $jsonData['firstname'], $jsonData['lastname'], $jsonData['email'], $hashedPassword, $jsonData['sex'], $jsonData['telephone_number']);
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



$app->get('/order_selections', function (Request $request, Response $response) {
    $conn = $GLOBALS['connect'];
    $sql = 'SELECT * FROM borrowing_returning
    INNER JOIN order_borrow_return ON borrowing_returning.borrowing_returning_id = order_borrow_return.borrowing_returning_id
    INNER JOIN equipmentlist ON order_borrow_return.equipmentlist_id = equipmentlist.equipmentlist_id
    INNER JOIN member ON borrowing_returning.member_id = member.member_id';
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

$app->get('/edit_equipment/{equipmentlist_id}', function (Request $request, Response $response, $args) {
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

$app->get('/borrowedequipmentreport', function (Request $request, Response $response) {
    $conn = $GLOBALS['connect'];
    $sql = 'SELECT * FROM borrowing_returning
    INNER JOIN order_borrow_return ON borrowing_returning.borrowing_returning_id = order_borrow_return.borrowing_returning_id
    INNER JOIN equipmentlist ON order_borrow_return.equipmentlist_id = equipmentlist.equipmentlist_id
    INNER JOIN member ON borrowing_returning.member_id = member.member_id';
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

$app->get('/order_borrow_search', function (Request $request, Response $response) {
    $conn = $GLOBALS['connect'];
    $sql = 'SELECT * FROM borrowing_returning
    INNER JOIN order_borrow_return ON borrowing_returning.borrowing_returning_id = order_borrow_return.borrowing_returning_id
    INNER JOIN equipmentlist ON order_borrow_return.equipmentlist_id = equipmentlist.equipmentlist_id
    INNER JOIN member ON borrowing_returning.member_id = member.member_id';
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

$app->delete('/equipmentlist_delete/{equipmentlist_id}', function (Request $request, Response $response, $args) {
    $equipmentlist_id = $args['equipmentlist_id']; // รับค่า id จาก URL
    $conn = $GLOBALS['connect'];
    $stmt = $conn->prepare("DELETE FROM equipmentlist WHERE equipmentlist_id = ?");
    $stmt->bind_param("s", $equipmentlist_id);
    $stmt->execute();
    $result = $stmt->affected_rows;

    if ($result > 0) {
        // สำเร็จ
        $data = ["message" => "Admin added successfully", "affected_rows" => $result, "last_id" => $conn->insert_id];
        $response->getBody()->write(json_encode($data));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    } else {
        // ล้มเหลว
        return $response
            ->withJson(['error' => 'Failed to add admin'], 500)
            ->withHeader('Content-Type', 'application/json');
    }
});

$app->post('/add_equipment', function ($request, $response, $args) {
    $conn = $GLOBALS['connect'];

    // รับข้อมูลจาก FormData
    $postData = $request->getParsedBody();
    $uploadedFiles = $request->getUploadedFiles();

    // ตรวจสอบการอัปโหลดรูปภาพ
    if (empty($uploadedFiles['picture'])) {
        return $response->withJson(['error' => 'No picture uploaded'], 400);
    }

    $picture = $uploadedFiles['picture'];
    if ($picture->getError() !== UPLOAD_ERR_OK) {
        return $response->withJson(['error' => 'Failed to upload picture'], 500);
    }

    // บันทึกรูปภาพลงในโฟลเดอร์ที่กำหนด
    $uploadDirectory = __DIR__ . '/uploads/';
    if (!is_dir($uploadDirectory) && !mkdir($uploadDirectory, 0777, true) && !is_dir($uploadDirectory)) {
        throw new \RuntimeException(sprintf('Directory "%s" was not created', $uploadDirectory));
    }

    $extension = pathinfo($picture->getClientFilename(), PATHINFO_EXTENSION);
    $basename = bin2hex(random_bytes(8)); // ชื่อไฟล์แบบสุ่ม
    $filename = sprintf('%s.%0.8s', $basename, $extension);
    $picture->moveTo($uploadDirectory . $filename);

    // เตรียมข้อมูลที่จะบันทึกลงในฐานข้อมูล
    $equipmentlist_name = $postData['equipmentlist_name'];
    $equipmentlist_count = $postData['equipmentlist_count'];
    $equipmentlist_unit = $postData['equipmentlist_unit'];
    $equipmentlist_detail = $postData['equipmentlist_detail'];
    $admin_id = $postData['admin_id'];
    $equipmentlist_old_id = $postData['equipmentlist_old_id'];

    $sql = "INSERT INTO `equipmentlist` (`equipmentlist_picture`, `equipmentlist_name`, `equipmentlist_count`, `equipmentlist_unit`, `equipmentlist_detail`, `admin_id`, `equipmentlist_old_id`) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssissis', $filename, $equipmentlist_name, $equipmentlist_count, $equipmentlist_unit, $equipmentlist_detail, $admin_id, $equipmentlist_old_id);

    $stmt->execute();
    $result = $stmt->affected_rows;

    if ($result > 0) {
        // สำเร็จ
        $data = ["message" => "Admin added successfully", "affected_rows" => $result, "last_id" => $conn->insert_id];
        $response->getBody()->write(json_encode($data));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    } else {
        // ล้มเหลว
        return $response
            ->withJson(['error' => 'Failed to add admin'], 500)
            ->withHeader('Content-Type', 'application/json');
    }
});

$app->put('/update_equipment/{equipmentlist_id}', function (Request $request, Response $response, $args) {
    $equipmentlist_id = $args['equipmentlist_id'];

    // Read data from php://input
    $rawData = file_get_contents('php://input');
    $boundary = substr($rawData, 0, strpos($rawData, "\r\n"));

    if (empty($boundary)) {
        return $response->withJson(['error' => 'Invalid boundary in PUT request'], 400);
    }

    $parts = array_slice(explode($boundary, $rawData), 1);
    $data = [];
    foreach ($parts as $part) {
        if ($part == "--\r\n") break;
        $part = trim($part);
        if (empty($part)) continue;

        list($headers, $body) = explode("\r\n\r\n", $part, 2);
        $headers = explode("\r\n", $headers);
        $name = null;
        $filename = null;
        foreach ($headers as $header) {
            if (strpos($header, 'Content-Disposition:') === 0) {
                if (preg_match('/name="([^"]+)"/', $header, $nameMatch)) {
                    $name = $nameMatch[1];
                }
                if (preg_match('/filename="([^"]+)"/', $header, $filenameMatch)) {
                    $filename = $filenameMatch[1];
                }
            }
        }
        $data[$name] = $body;
    }

    $uploadDirectory = __DIR__ . '/uploads/';
    if (!is_dir($uploadDirectory) && !mkdir($uploadDirectory, 0777, true) && !is_dir($uploadDirectory)) {
        throw new \RuntimeException(sprintf('Directory "%s" was not created', $uploadDirectory));
    }

    $conn = $GLOBALS['connect'];

    $stmt = $conn->prepare("SELECT equipmentlist_picture FROM equipmentlist WHERE equipmentlist_id = ?");
    $stmt->bind_param('i', $equipmentlist_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $oldFilename = $row['equipmentlist_picture'];

    $oldFileExtension = pathinfo($oldFilename, PATHINFO_EXTENSION);

    if (!empty($filename)) {
        $newFileExtension = pathinfo($filename, PATHINFO_EXTENSION);

        if ($newFileExtension !== $oldFileExtension) {
            $filename = pathinfo($filename, PATHINFO_FILENAME) . '.' . $oldFileExtension;
        }

        file_put_contents($uploadDirectory . $filename, $data['picture']);
    } else {
        $filename = $oldFilename;
    }

    $sql = "UPDATE equipmentlist SET equipmentlist_name = ?, equipmentlist_count = ?, equipmentlist_unit = ?, equipmentlist_detail = ?, equipmentlist_picture = ? WHERE equipmentlist_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sisssi', $data["equipmentlist_name"], $data["equipmentlist_count"], $data["equipmentlist_unit"], $data["equipmentlist_detail"], $filename, $equipmentlist_id);
    $stmt->execute();

    $affected = $stmt->affected_rows;
    if ($affected > 0) {
        $response->getBody()->write(json_encode(["affected_rows" => $affected]));
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