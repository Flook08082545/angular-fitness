<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$app->post('/OTP_save', function (Request $request, Response $response, $args) {
    // Get the email from the request body
    $json = $request->getBody();
    $jsonData = json_decode($json, true);
    $email = $jsonData['email'];

    // Generate a random OTP
    $otp = mt_rand(100000, 999999);

    // Set the OTP in session
    session_start();
    $_SESSION['otp'] = $otp;
    $_SESSION['email'] = $email;

    // Send the OTP via email
    $mail_content = "รหัส OTP ของคุณคือ: $otp";

    // Create a new PHPMailer instance
    $mail = new PHPMailer(true);

    // Connect to the SMTP server
    $mail->isSMTP();
    $mail->Host = "smtp.gmail.com";
    $mail->SMTPAuth = true;
    $mail->Username = 'flook0961458054.f@gmail.com';
    $mail->Password = 'ejdgrkfthjdwfwkk';
    $mail->SMTPSecure = 'tls';
    $mail->Port = "587";

    // Set the sender
    $mail->setFrom('flook0961458054.f@gmail.com', 'Your Name');

    // Set the recipient
    $mail->addAddress($email);

    // Set email format to plain text
    $mail->isHTML(false);
    $mail->Subject = 'Fitness OTP';
    $mail->Body = $mail_content;

    // Send the email
    if (!$mail->send()) {
        $response->getBody()->write("เกิดข้อผิดพลาดในการส่งอีเมล: {$mail->ErrorInfo}");
        return $response->withStatus(500);
    }

    // Return the response with OTP in session
    $response->getBody()->write(json_encode(['otp' => $otp]));
    return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
});


// $app->post('/OTP_save', function (Request $request, Response $response, $args) {
//     $json = $request->getBody();
//     $jsonData = json_decode($json, true);
//     $email = $jsonData['email'];

//     // Generate a random OTP
//     $otp = mt_rand(100000, 999999);

//     // Recipient email
//     $recipient_email = $email;

//     // Email content
//     $mail_content = "รหัส OTP ของคุณคือ: $otp";

//     // Create a new PHPMailer instance
//     $mail = new PHPMailer(true);

//     // Connect to the database
//     $conn = $GLOBALS['connect'];

//     // SMTP configuration
//     $mail->isSMTP();
//     $mail->Host = "smtp.gmail.com";
//     $mail->SMTPAuth = true;
//     $mail->Username = 'flook0961458054.f@gmail.com';
//     $mail->Password = 'ejdgrkfthjdwfwkk';
//     $mail->SMTPSecure = 'tls';
//     $mail->Port = "587";

//     // Set the sender
//     $mail->setFrom('flook0961458054.f@gmail.com', 'Your Name');

//     // Set the recipient
//     $mail->addAddress($recipient_email);

//     // Set email format to plain text
//     $mail->isHTML(false);
//     $mail->Subject = 'Fitness OTP';
//     $mail->Body = $mail_content;

//     // Send the email
//     if (!$mail->send()) {
//         $response->getBody()->write("เกิดข้อผิดพลาดในการส่งอีเมล: {$mail->ErrorInfo}");
//         return $response->withStatus(500);
//     }

//     $sql = "INSERT INTO `otp_table` (`email`, `otp`) VALUES (?, ?)";
//     $stmt = $conn->prepare($sql);
//     $stmt->bind_param('ss', $email, $otp);

//     $stmt->execute();
//     $result = $stmt->affected_rows;

//     if ($result > 0) {
//         // สำเร็จ
//         $data = ["message" => "Admin added successfully", "affected_rows" => $result, "last_id" => $conn->insert_id];
//         $response->getBody()->write(json_encode($data));
//         return $response
//             ->withHeader('Content-Type', 'application/json')
//             ->withStatus(200);
//     } else {
//         // ล้มเหลว
//         return $response
//             ->withJson(['error' => 'Failed to add admin'], 500)
//             ->withHeader('Content-Type', 'application/json');
//     }

//     // $stmt->close();
//     // $conn->close();

//     $response->getBody()->write('ส่งรหัส OTP สำเร็จ!');
//     return $response->withStatus(200);
// });



    // $app->get('/OTP_verify', function (Request $request, Response $response) {
    //     $conn = $GLOBALS['connect'];
    //     $sql = 'SELECT * FROM otp_table';
    //     $stmt = $conn->prepare($sql);
    //     $stmt->execute();
    //     $result = $stmt->get_result();
    //     $data = array();
    //     foreach ($result as $row) {
    //         array_push($data, $row);
    //     }
    
    //     $response->getBody()->write(json_encode($data, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK));
    //     return $response
    //         ->withHeader('Content-Type', 'application/json; charset=utf-8')
    //         ->withStatus(200);
    // });
    
    // $app->post('/OTP_save', function (Request $request, Response $response, $args) {
    //     $json = $request->getBody();
    //     $jsonData = json_decode($json, true);
    //     $email = $jsonData['email'];
    
    //     // Connect to the database
    //     $conn = $GLOBALS['connect'];
    
    //     $sql = "SELECT * FROM otp_table WHERE email = ? AND otp = ?";
    //     $stmt = $conn->prepare($sql);
    //     $stmt->bind_param('ss', $email, $otp);
    
    //     $stmt->execute();
    //     $result = $stmt->affected_rows;
    
    //     if ($result > 0) {
    //         // สำเร็จ
    //         $data = ["message" => "Admin added successfully", "affected_rows" => $result, "last_id" => $conn->insert_id];
    //         $response->getBody()->write(json_encode($data));
    //         return $response
    //             ->withHeader('Content-Type', 'application/json')
    //             ->withStatus(200);
    //     } else {
    //         // ล้มเหลว
    //         return $response
    //             ->withJson(['error' => 'Failed to add admin'], 500)
    //             ->withHeader('Content-Type', 'application/json');
    //     }
    // });
    
    // $app->get('/OTP_verify_check', function (Request $request, Response $response) {
    //     $conn = $GLOBALS['connect'];
    //     $email = $request->getQueryParams()['email'] ?? null;
    //     $otp = $request->getQueryParams()['otp'] ?? null;
    
    //     if ($email && $otp) {
    //         $sql = 'SELECT * FROM otp_table WHERE email = ? AND otp = ?';
    //         $stmt = $conn->prepare($sql);
    //         $stmt->bind_param('ss', $email, $otp);
    //         $stmt->execute();
    //         $result = $stmt->get_result();
    
    //         if ($result->num_rows > 0) {
    //             $data = $result->fetch_all(MYSQLI_ASSOC);
    //             $response->getBody()->write(json_encode($data, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK));
    //             return $response
    //                 ->withHeader('Content-Type', 'application/json; charset=utf-8')
    //                 ->withStatus(200);
    //         } else {
    //             $response->getBody()->write(json_encode(['error' => 'Invalid OTP'], JSON_UNESCAPED_UNICODE));
    //             return $response
    //                 ->withHeader('Content-Type', 'application/json; charset=utf-8')
    //                 ->withStatus(401);
    //         }
    //     } else {
    //         $response->getBody()->write(json_encode(['error' => 'Email and OTP are required'], JSON_UNESCAPED_UNICODE));
    //         return $response
    //             ->withHeader('Content-Type', 'application/json; charset=utf-8')
    //             ->withStatus(400);
    //     }
    // });
    
?>
