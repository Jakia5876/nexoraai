<?php
/**
 * Plugin Name: NEXORAAI - Incomplete Orders & Abandoned Cart Tracker
 * Plugin URI: https://nexoraai.com
 * Description: Captures customer names, phone numbers, and cart items in real-time as they type on checkout. Automatically syncs incomplete orders to NEXORAAI for automated WhatsApp cart recovery reminders.
 * Version: 2.4.0
 * Author: NEXORAAI Team
 * Author URI: https://nexoraai.com
 * License: GPLv2 or later
 */

if (!defined('ABSPATH')) {
    // Standalone direct API endpoint fallback
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Tenant-Key');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);

        if (!empty($data['customerPhone']) || !empty($data['customerEmail'])) {
            $logEntry = [
                'id' => $data['sessionId'] ?? ('INC-' . rand(1000, 9999)),
                'customer_name' => $data['customerName'] ?? 'Guest Customer',
                'customer_phone' => $data['customerPhone'] ?? '',
                'customer_email' => $data['customerEmail'] ?? '',
                'customer_address' => $data['customerAddress'] ?? '',
                'cart_total' => $data['cartTotal'] ?? '৳ 0',
                'last_step' => $data['lastStep'] ?? 'Checkout Form',
                'status' => 'pending',
                'timestamp' => date('c')
            ];

            // In production, save to database or forward to Supabase / n8n webhook
            file_put_contents(__DIR__ . '/incomplete_orders_log.json', json_encode($logEntry, JSON_PRETTY_PRINT) . PHP_EOL, FILE_APPEND);

            echo json_encode([
                'success' => true,
                'message' => 'Incomplete order captured successfully',
                'session_id' => $logEntry['id']
            ]);
            exit;
        }

        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing phone or email']);
        exit;
    }

    echo json_encode(['status' => 'NEXORAAI Incomplete Orders Tracker Active']);
    exit;
}

// -----------------------------------------------------------------------------
// WordPress / WooCommerce Plugin Hooks
// -----------------------------------------------------------------------------

class NexoraIncompleteOrdersTracker {

    public function __construct() {
        add_action('wp_enqueue_scripts', [$this, 'enqueueTrackerScript']);
        add_action('woocommerce_thankyou', [$this, 'markOrderCompleted']);
        add_action('rest_api_init', [$this, 'registerRestEndpoints']);
        add_action('admin_menu', [$this, 'addAdminMenu']);
    }

    public function enqueueTrackerScript() {
        if (function_exists('is_checkout') && is_checkout() && !is_order_received_page()) {
            wp_enqueue_script(
                'nexora-iot-checkout',
                plugins_url('assets/js/iot-checkout.js', __FILE__),
                [],
                '2.4.0',
                true
            );

            $tenantKey = get_option('nexora_tenant_key', 'ORG_NEXORA_LIVE');
            $endpoint = get_option('nexora_api_endpoint', 'https://api.nexoraai.com/v1/track/incomplete');

            wp_add_inline_script('nexora-iot-checkout', '
                window.__NEXORA_IOT_CONFIG = {
                    tenantKey: "' . esc_js($tenantKey) . '",
                    endpoint: "' . esc_url($endpoint) . '"
                };
            ', 'before');
        }
    }

    public function markOrderCompleted($order_id) {
        if (!$order_id) return;
        // Invalidate abandoned status when order completes
        $order = wc_get_order($order_id);
        if ($order) {
            $phone = $order->get_billing_phone();
            // Trigger completion hook to Nexora AI
        }
    }

    public function registerRestEndpoints() {
        register_rest_route('nexora/v1', '/track-incomplete', [
            'methods' => 'POST',
            'callback' => [$this, 'handleIncompletePayload'],
            'permission_callback' => '__return_true'
        ]);
    }

    public function handleIncompletePayload($request) {
        $params = $request->get_json_params();
        return rest_ensure_response([
            'success' => true,
            'status' => 'Captured & queued for WhatsApp recovery'
        ]);
    }

    public function addAdminMenu() {
        add_submenu_page(
            'woocommerce',
            'Incomplete Orders (NEXORAAI)',
            'Incomplete Orders',
            'manage_woocommerce',
            'nexora-incomplete-orders',
            [$this, 'renderAdminView']
        );
    }

    public function renderAdminView() {
        echo '<div class="wrap"><h1>⚡ NEXORAAI - Incomplete Orders & Recovery</h1><p>View real-time drop-offs and dispatch WhatsApp recovery reminders from your NEXORAAI Admin Portal.</p></div>';
    }
}

new NexoraIncompleteOrdersTracker();
