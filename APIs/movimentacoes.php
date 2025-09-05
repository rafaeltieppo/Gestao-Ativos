<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

include 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $codigo_ativo = $input['codigo_ativo'] ?? '';
    $funcionario_responsavel = $input['funcionario_responsavel'] ?? '';
    $status = $input['status'] ?? 'pendente';

    if (!$codigo_ativo || !$funcionario_responsavel) {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Campos obrigatórios: codigo_ativo, tipo, funcionario_responsavel']);
        exit;
    }

    $sql = "INSERT INTO movimentacoes (codigo_ativo, funcionario_responsavel, status) 
            VALUES (?, ?, ?)";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Erro no prepare: ' . $conn->error]);
        exit;
    }

    $stmt->bind_param("iss", $codigo_ativo, $funcionario_responsavel, $status);

    if (!$stmt->execute()) {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Erro no execute: ' . $stmt->error]);
        exit;
    }

    echo json_encode([
        'sucesso' => $stmt->affected_rows > 0,
        'mensagem' => $stmt->affected_rows > 0 ? 'Movimentação registrada' : 'Erro ao registrar movimentação'
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $id = $input['id'] ?? 0;
    $codigo_ativo = $input['codigo_ativo'] ?? '';
    $funcionario_responsavel = $input['funcionario_responsavel'] ?? '';
    $status = $input['status'] ?? 'pendente';

    if (!$id || !$codigo_ativo || !$funcionario_responsavel) {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Campos obrigatórios: id, codigo_ativo, tipo, funcionario_responsavel']);
        exit;
    }

    // Se o status for 'devolvido', atualiza data_devolucao com CURRENT_TIMESTAMP
    if ($status === 'devolvido') {
        $sql = "UPDATE movimentacoes 
                SET status = ?, data_devolucao = CURRENT_TIMESTAMP 
                WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $status, $id);
    } else {
        $sql = "UPDATE movimentacoes 
                SET codigo_ativo = ?, funcionario_responsavel = ?, status = ? 
                WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("issssi", $codigo_ativo, $funcionario_responsavel, $status, $id);
    }

    $stmt->execute();

    echo json_encode([
        'sucesso' => $stmt->affected_rows >= 0,
        'mensagem' => 'Movimentação atualizada'
    ]);
    exit;
}


if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT m.id,
                   m.funcionario_responsavel, 
                   m.data_saida, 
                   m.data_devolucao, 
                   m.status,
                   a.descricao AS descricao,
                   a.codigo AS codigo_ativo
            FROM movimentacoes m
            JOIN ativos a ON m.codigo_ativo = a.codigo
            ORDER BY m.data_saida DESC";
    $result = $conn->query($sql);
    $movs = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($movs);
    exit;
}
?>