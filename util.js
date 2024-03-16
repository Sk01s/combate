export function attackCollision(player1, player2) {
  return (
    Math.floor(player1.attackBox.position.x + player1.attackBox.width) >=
      Math.floor(player2.position.x) &&
    Math.floor(player1.attackBox.position.x) <=
      Math.floor(player2.position.x + player2.width) &&
    Math.floor(player1.attackBox.position.y) >=
      Math.floor(player2.position.y) &&
    Math.floor(player1.attackBox.position.y + player1.attackBox.height) <=
      Math.floor(player2.position.y + player2.height)
  );
}
