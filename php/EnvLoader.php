<?php
class EnvLoader {
    private $variables = [];

    public function __construct(string $envFile = null) {
        if ($envFile === null) {
            $envFile = __DIR__ . '/../.env';
        }

        if (file_exists($envFile)) {
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                $line = trim($line);
                if ($line === '' || $line[0] === '#') {
                    continue;
                }

                list($name, $value) = explode('=', $line, 2);
                $name = trim($name);
                $value = trim($value);
                $this->variables[$name] = $value;
                putenv("$name=$value");
            }
        }
    }

    public function get(string $key, $default = null) {
        return $this->variables[$key] ?? getenv($key) ?: $default;
    }
}
?>