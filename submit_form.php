<?php

// Get the request method
$method = $_SERVER['REQUEST_METHOD'];

// Check if the method is POST
if ($method === 'POST') {
    // Sanitize and trim inputs
    $project_name = isset($_POST["project_name"]) ? trim($_POST["project_name"]) : "";
    $admin_email = isset($_POST["admin_email"]) ? trim($_POST["admin_email"]) : "";
    $form_subject = isset($_POST["form_subject"]) ? trim($_POST["form_subject"]) : "";

    // Initialize the message variable
    $message = "";

    // Construct the message body
    foreach ($_POST as $key => $value) {
        // Exclude predefined fields and empty values
        if ($value !== "" && $key !== "project_name" && $key !== "admin_email" && $key !== "form_subject") {
            // Sanitize and concatenate key-value pairs
            $message .= "<tr>";
            $message .= "<td style='padding: 10px; border: #e9e9e9 1px solid;'><b>" . htmlspecialchars($key) . "</b></td>";
            $message .= "<td style='padding: 10px; border: #e9e9e9 1px solid;'>" . htmlspecialchars($value) . "</td>";
            $message .= "</tr>";
        }
    }

    // Wrap the message in a table
    $message = "<table style='width: 100%;'>$message</table>";

    // Encode special characters in project name for headers
    $project_name_encoded = '=?UTF-8?B?' . base64_encode($project_name) . '?=';

    // Set additional headers
    $headers = "MIME-Version: 1.0" . PHP_EOL .
        "Content-Type: text/html; charset=utf-8" . PHP_EOL .
        'From: ' . $project_name_encoded . ' <' . $admin_email . '>' . PHP_EOL .
        'Reply-To: ' . $admin_email . '' . PHP_EOL;

    // Send the email
    if (mail($admin_email, $form_subject, $message, $headers)) {
        // Email sent successfully
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Message sent successfully"]);
    } else {
        // Failed to send email
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to send message"]);
    }
} else {
    // Method not allowed
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method Not Allowed"]);
}
?>
