<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Sendy Configuration
define('SENDY_API_URL', 'https://mailing.wiseloan.com'); // Replace with your actual Sendy URL
define('SENDY_API_KEY', 'KSolZuSHxjxxxwwKUQIYaWujN');           // Replace with your actual API key

// List of Sendy List IDs
$sendyLists = ['list_id1', 'list_id2']; // Replace with your actual Sendy list IDs

// Database connection (optional if not required for other logs)
$servername = "localhost"; // Adjust your database server if needed
$username = "root";        // Replace with your DB username
$password = "";            // Replace with your DB password
$dbname = "email_data";    // Replace with your DB name

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

// Get the JSON payload from Mailgun
$raw_data = file_get_contents('php://input');

// Log raw payload for debugging
file_put_contents('payload_log.txt', $raw_data . "\n", FILE_APPEND);

// Decode the JSON data
$data = json_decode($raw_data, true);

// Extract email from Mailgun payload
if (isset($data['event-data']['recipient'])) {
    $email = $data['event-data']['recipient']; // The email address to unsubscribe
} else {
    file_put_contents('error_log.txt', "Invalid payload: No recipient found\n", FILE_APPEND);
    die("No recipient found in payload.");
}

// Unsubscribe the email from all Sendy lists
foreach ($sendyLists as $listId) {
    $unsubscribeResult = unsubscribeFromSendy($email, $listId);
    if ($unsubscribeResult['status'] === 'success') {
        echo "Successfully unsubscribed $email from list ID $listId\n";
    } else {
        echo "Failed to unsubscribe $email from list ID $listId: " . $unsubscribeResult['message'] . "\n";
    }
}

// Function to call Sendy API for unsubscribing
function unsubscribeFromSendy($email, $listId)
{
    $url = SENDY_API_URL . '/api/subscribers/unsubscribe';
    $postData = [
        'email' => $email,
        'list_id' => $listId,
        'boolean' => 'true', // Boolean response format
        'api_key' => SENDY_API_KEY,
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200 && $response === 'true') {
        return ['status' => 'success'];
    } else {
        return ['status' => 'error', 'message' => $response];
    }
}

// Close database connection
$conn->close();
?>
